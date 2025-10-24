import { S3Client, CompleteMultipartUploadCommand, AbortMultipartUploadCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { CompletedPart, S3ClientConfig } from "@aws-sdk/client-s3"
import { Upload } from '@aws-sdk/lib-storage'
import type { Progress } from '@aws-sdk/lib-storage'

import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
 */

export function useS3Upload() {
  const toast = useToast()
  const isUploading = ref(false)
  const fileObject = ref<File| undefined>()
  const uploadParams = ref({})
  const uploadProgress = ref(0)
  const uploadResponse = ref(null)
  const url = ref('')
  const ongoingUpload = useLocalStorage('ongoingUpload', undefined)
  const uploadObject = ref()
  // const VITE_AWS_BUCKET_NAME = 'dna-portal-pasir-silika'
  // const VITE_WASABI_ACCESS_KEY_ID = 'IFGBWYV0LJNCBYZAVTWX'
  // const VITE_WASABI_SECRET_ACCESS_KEY = 'Ba5bO5hdgHTBhinENaWyId6ebpyZAn44dsD4K8Ov'
  // const VITE_WASABI_REGION = 'ap-southeast-1'
  const VITE_AWS_BUCKET_NAME = 'portal-bayur-jaya-v1'
  const VITE_WASABI_ACCESS_KEY_ID = 'B2MREYBZV8NQ1KX1S7N0'
  const VITE_WASABI_SECRET_ACCESS_KEY = 'Oqiho03Ecle1Gsr1oQnehzqheQSw45l2r5JzdU8s'
  const VITE_WASABI_REGION = 'ap-southeast-1'

  const createClient =  () => {
    // const Bucket = 'dna-portal-pasir-silika'

    const config: S3ClientConfig = {
      region: VITE_WASABI_REGION,
      endpoint: "https://s3.ap-southeast-1.wasabisys.com", // ✅ Wasabi endpoint
      forcePathStyle: true, 
      credentials: {
        accessKeyId: VITE_WASABI_ACCESS_KEY_ID,
        secretAccessKey: VITE_WASABI_SECRET_ACCESS_KEY,
      },
    }
    // params: {
    //     Bucket
    //   }

    const s3 = new S3Client(config)

    // workaround for the issue: https://github.com/aws/aws-sdk-js-v3/issues/1800
    // s3.middlewareStack.add(
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   (next, context) => (args) => {
    //     delete args.request.headers["content-type"]
    //     return next(args)
    //   },
    //   {
    //     step: "build",
    //   }
    // )
    return s3
  }

  const completeMultipartUpload = async (uploadedParts: CompletedPart[], Key:string, UploadId:string) => {
    const client = createClient()
    const input = {
      Bucket: VITE_AWS_BUCKET_NAME,
      Key,
      MultipartUpload: {
        Parts: uploadedParts
      },
      UploadId
    }
    const command = new CompleteMultipartUploadCommand(input)
    const response = await client.send(command)
    return response
  }

  const generateUploadParams = (file:File) => {
    const [type] =  file.type.split('/')
    const folderName = type // image/video

    //create unique file-name for aws bucket
    const unixTimestamp = new Date().getTime()
    const encodedName = encodeURIComponent(file.name)
    const filename = `${unixTimestamp}-${encodedName}`

    const Key = `${folderName}/${filename}`
    return {
      Bucket: VITE_AWS_BUCKET_NAME,
      Key,
      Body:file,
      ContentType:file.type,
      Filename: filename
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPresignedUrl = async (key: string) => {
    const client = createClient();
    const command = new GetObjectCommand({
      Bucket: VITE_AWS_BUCKET_NAME,
      Key: key,
    });
    // The URL will be valid for 1 hour
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }

  async function upload (file:File) {
    removeUploadFlag()
    const objectParams = generateUploadParams(file)
    console.log(objectParams)
    fileObject.value = file
    uploadParams.value = objectParams
    isUploading.value = true
    try {
      const client = createClient()
      // from : https://stackoverflow.com/a/73583538
      uploadObject.value = new Upload({
        client,
        params: objectParams
      })
      
      uploadObject.value.on("httpUploadProgress", (progress:Progress) => {
        createUploadFlag()
        if (!progress.total || !progress.loaded) return
        uploadProgress.value = Math.round(progress.loaded / progress.total * 100)
      })
  
      await uploadObject.value.done()
      console.log(uploadObject.value.isMultiPart, 'multipart?');
      
      if (!uploadObject.value.isMultiPart) {
        // const presignedUrl = await getPresignedUrl(objectParams.Key);
        // url.value = presignedUrl
        console.log({uploadObject});
        
        url.value = uploadObject.value.singleUploadResult.Location
        console.log(url.value);
        
      }else {
        const result = await completeMultipartUpload(
          uploadObject.value.uploadedParts,
          objectParams.Key,
          uploadObject.value.uploadId
          )
        url.value = result.Location!
      }
      uploadResponse.value = uploadObject.value
      isUploading.value = false
      finishUploadFlag()
    } catch (error: Error | unknown) {
      await uploadErrorHandler(error as Error)
    } finally {
      isUploading.value = false
    }
  }

  const revokeFailedUpload = async () => {

    // if (ongoingUpload.value === "undefined" || !ongoingUpload.value) return
    const lastSavedUpload = JSON.parse(ongoingUpload.value!)
    

    const { 
      params: {
        Key
      },
      uploadObject: {
        uploadId
      }
    } = lastSavedUpload

    try {
      const params = {
        Bucket: VITE_AWS_BUCKET_NAME,
        Key,
        UploadId: uploadId,
      }

      const client = createClient()
      const abortCommand = new AbortMultipartUploadCommand(params)
      const response = await client.send(abortCommand)
      console.log({AbortMultipartUploadCommand:response});
      
      toast.add({
        description: `Terjadi eror saat mengunggah berkas sebelumnya. Silakan unggah ulang berkas Anda.`,
        title: `Berkas Sebelumnya Belum Berhasil Diunggah`
      })
      removeUploadFlag()
    } catch (error) {
      console.log({AbortMultipartUploadCommand:error});
    }
  }

  const uploadErrorHandler = async (error: Error) => {
    // https://docs.aws.amazon.com/id_id/AmazonS3/latest/userguide/mpu-upload-object.html

    if(uploadObject.value.isMultiPart) await revokeFailedUpload()
    console.log(error)
      
    const errorNotification = {
      description: error.message,
      show: true,
      title: `Belum Berhasil Menyimpan Gambar`
    }
    toast.add(errorNotification)
  }

  const createUploadFlag = () => {
    // updates local storage value
    if (!uploadObject.value.isMultiPart) { return }
    localStorage.setItem('ongoingUpload', JSON.stringify({params: uploadParams.value , stuck: uploadProgress.value, uploadObject:uploadObject.value, isComplete:false}))
  }
  const finishUploadFlag = () => {
    localStorage.setItem('ongoingUpload', JSON.stringify({params: uploadParams.value , stuck: uploadProgress.value, uploadObject:uploadObject.value, isComplete:true}))
    removeUploadFlag()
  }
  const removeUploadFlag = () => {
    const flag = localStorage.getItem('ongoingUpload')
    if (!flag) return
    localStorage.removeItem('ongoingUpload')
  }

  const abortUploadReminder = async () => {
    // localStorage null handler
    if (!ongoingUpload.value || ongoingUpload.value === 'undefined' ) {return}

    const abortUpload = JSON.parse(ongoingUpload.value)
    if (!abortUpload.isComplete) {
      await revokeFailedUpload()
    }
  }

  onMounted(async () => {
    await abortUploadReminder()
  })
  return { isUploading, uploadProgress, upload, url , file:fileObject, ongoingUpload}
}
