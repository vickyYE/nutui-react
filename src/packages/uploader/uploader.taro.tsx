import React, {
  useState,
  useImperativeHandle,
  ForwardRefRenderFunction,
  PropsWithChildren,
  useEffect,
} from 'react'
import classNames from 'classnames'
import Taro, { chooseImage, uploadFile, getEnv } from '@tarojs/taro'
import Icon from '@/packages/icon/index.taro'
import Button from '@/packages/button/index.taro'
import Progress from '@/packages/progress/index.taro'
import { Upload, UploadOptions } from './upload'
import bem from '@/utils/bem'
import { useConfig } from '@/packages/configprovider/configprovider.taro'

import { BasicComponent, ComponentDefaults } from '@/utils/typings'

export type FileType<T> = { [key: string]: T }

export type FileItemStatus =
  | 'ready'
  | 'uploading'
  | 'success'
  | 'error'
  | 'removed'

/** 图片的尺寸 */
interface sizeType {
  /** 原图 */
  original: string
  /** compressed */
  compressed: string
}

/** 图片的来源 */
interface sourceType {
  /** 从相册选图 */
  album: string
  /** 使用相机 */
  camera: string
  /** 使用前置摄像头(仅H5纯浏览器使用) */
  user: string
  /** 使用后置摄像头(仅H5纯浏览器) */
  environment: string
}

export interface UploaderProps extends BasicComponent {
  url: string
  maximum: string | number
  sizeType: (keyof sizeType)[]
  sourceType: (keyof sourceType)[]
  maximize: number
  defaultFileList: FileType<string>[]
  listType: string
  uploadIcon: string
  uploadIconSize: string | number
  uploadIconTip: string
  name: string
  disabled: boolean
  autoUpload: boolean
  multiple: boolean
  timeout: number
  data: object
  method: string
  xhrState: number | string
  headers: object
  isPreview: boolean
  isDeletable: boolean
  className: string
  defaultImg: string
  style: React.CSSProperties
  onStart?: (option: UploadOptions) => void
  onRemove?: (file: FileItem, fileList: FileType<string>[]) => void
  onSuccess?: (param: {
    responseText: XMLHttpRequest['responseText']
    option: UploadOptions
  }) => void
  onProgress?: (param: {
    e: ProgressEvent<XMLHttpRequestEventTarget>
    option: UploadOptions
    percentage: string | number
  }) => void
  onFailure?: (param: {
    responseText: XMLHttpRequest['responseText']
    option: UploadOptions
  }) => void
  onUpdate?: (fileList: FileType<string>[]) => void
  onOversize?: (file: Taro.chooseImage.ImageFile[]) => void
  onChange?: (param: { fileList: FileType<string>[] }) => void
  onBeforeUpload?: (file: Taro.chooseImage.ImageFile[]) => Promise<any[]>
  onBeforeXhrUpload?: (xhr: XMLHttpRequest, options: any) => void
  onBeforeDelete?: (file: FileItem, files: FileType<string>[]) => boolean
  onFileItemClick?: (file: FileItem) => void
}

const defaultProps = {
  ...ComponentDefaults,
  url: '',
  maximum: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  uploadIcon: 'photograph',
  uploadIconSize: '',
  uploadIconTip: '',
  listType: 'picture',
  name: 'file',
  disabled: false,
  autoUpload: true,
  multiple: false,
  maximize: Number.MAX_VALUE,
  data: {},
  headers: {},
  method: 'post',
  defaultImg: '',
  xhrState: 200,
  timeout: 1000 * 30,
  isPreview: true,
  isDeletable: true,
  onBeforeDelete: (file: FileItem, files: FileType<string>[]) => {
    return true
  },
} as UploaderProps

export class FileItem {
  status: FileItemStatus = 'ready'

  message = '准备中..'

  uid: string = new Date().getTime().toString()

  name?: string

  url?: string

  type?: string

  path?: string

  percentage: string | number = 0

  formData: any = {}
}
const InternalUploader: ForwardRefRenderFunction<
  unknown,
  PropsWithChildren<Partial<UploaderProps>>
> = (props, ref) => {
  const { locale } = useConfig()
  const {
    children,
    uploadIcon,
    uploadIconSize,
    uploadIconTip,
    name,
    defaultFileList,
    listType,
    disabled,
    multiple,
    url,
    defaultImg,
    headers,
    timeout,
    method,
    xhrState,
    data,
    isPreview,
    isDeletable,
    maximum,
    maximize,

    className,
    autoUpload,
    sizeType,
    sourceType,
    iconClassPrefix,
    iconFontClassName,
    onStart,
    onRemove,
    onChange,
    onFileItemClick,
    onProgress,
    onSuccess,
    onUpdate,
    onFailure,
    onOversize,
    onBeforeUpload,
    onBeforeXhrUpload,
    onBeforeDelete,
    ...restProps
  } = { ...defaultProps, ...props }
  const [fileList, setFileList] = useState<FileType<string>[]>([])
  const [uploadQueue, setUploadQueue] = useState<Promise<Upload>[]>([])

  useEffect(() => {
    if (defaultFileList) {
      setFileList(defaultFileList)
    }
  }, [defaultFileList])

  const b = bem('uploader')
  const classes = classNames(className, b(''))

  useImperativeHandle(ref, () => ({
    submit: () => {
      Promise.all(uploadQueue).then((res) => {
        res.forEach((i) => i.uploadTaro(uploadFile, getEnv()))
      })
    },
  }))

  const clearUploadQueue = (index = -1) => {
    if (index > -1) {
      uploadQueue.splice(index, 1)
      setUploadQueue(uploadQueue)
    } else {
      setUploadQueue([])
    }
  }

  const _chooseImage = () => {
    if (disabled) {
      return
    }
    chooseImage({
      // 选择数量
      count: multiple ? (maximum as number) * 1 - fileList.length : 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType,
      sourceType,
      success: onChangeFn,
    })
  }

  const executeUpload = (fileItem: FileItem, index: number) => {
    const uploadOption = new UploadOptions()
    uploadOption.name = name
    uploadOption.url = url
    uploadOption.fileType = fileItem.type
    uploadOption.formData = fileItem.formData
    uploadOption.timeout = timeout * 1
    uploadOption.method = method
    uploadOption.xhrState = xhrState
    uploadOption.headers = headers
    uploadOption.taroFilePath = fileItem.path
    uploadOption.beforeXhrUpload = onBeforeXhrUpload

    uploadOption.onStart = (option: UploadOptions) => {
      clearUploadQueue(index)
      setFileList((fileList: FileType<string>[]) => {
        fileList.map((item) => {
          if (item.uid === fileItem.uid) {
            item.status = 'ready'
            item.message = locale.uploader.readyUpload
          }
        })
        return [...fileList]
      })
      onStart && onStart(option)
    }

    uploadOption.onProgress = (e: any, option: UploadOptions) => {
      setFileList((fileList: FileType<string>[]) => {
        fileList.map((item) => {
          if (item.uid === fileItem.uid) {
            item.status = 'uploading'
            item.message = locale.uploader.uploading
            item.percentage = e.progress
            onProgress && onProgress({ e, option, percentage: item.percentage })
          }
        })
        return [...fileList]
      })
    }

    uploadOption.onSuccess = (
      responseText: XMLHttpRequest['responseText'],
      option: UploadOptions
    ) => {
      setFileList((fileList: FileType<string>[]) => {
        onUpdate && onUpdate(fileList)
        fileList.map((item) => {
          if (item.uid === fileItem.uid) {
            item.status = 'success'
            item.message = locale.uploader.success
          }
        })
        return [...fileList]
      })
      onSuccess &&
        onSuccess({
          responseText,
          option,
        })
    }

    uploadOption.onFailure = (
      responseText: XMLHttpRequest['responseText'],
      option: UploadOptions
    ) => {
      setFileList((fileList: FileType<string>[]) => {
        fileList.map((item) => {
          if (item.uid === fileItem.uid) {
            item.status = 'error'
            item.message = locale.uploader.error
          }
        })
        return [...fileList]
      })
      onFailure &&
        onFailure({
          responseText,
          option,
        })
    }

    const task = new Upload(uploadOption)
    if (props.autoUpload) {
      task.uploadTaro(uploadFile, getEnv())
    } else {
      uploadQueue.push(
        new Promise((resolve, reject) => {
          resolve(task)
        })
      )
      setUploadQueue(uploadQueue)
    }
  }

  const readFile = (files: Taro.chooseImage.ImageFile[]) => {
    const imgReg = /\.(png|jpeg|jpg|webp|gif)$/i
    files.forEach((file: Taro.chooseImage.ImageFile, index: number) => {
      console.log('file', file)
      let fileType = file.type
      const fileItem = new FileItem()
      if (!fileType && imgReg.test(file.path)) {
        fileType = 'image'
      }
      fileItem.path = file.path
      fileItem.name = file.path
      fileItem.status = 'ready'
      fileItem.message = locale.uploader.readyUpload
      fileItem.type = fileType

      if (getEnv() === 'WEB') {
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value)
        }
        formData.append(name, file.originalFileObj as Blob)
        fileItem.name = file.originalFileObj?.name
        fileItem.type = file.originalFileObj?.type
        fileItem.formData = formData
      } else {
        fileItem.formData = data as any
      }
      if (isPreview) {
        fileItem.url = file.path
      }

      fileList.push(fileItem as any)
      setFileList([...fileList])
      executeUpload(fileItem, index)
    })
  }

  const filterFiles = (files: Taro.chooseImage.ImageFile[]) => {
    const maximum = (props.maximum as number) * 1
    const maximize = (props.maximize as number) * 1
    const oversizes = new Array<Taro.chooseImage.ImageFile>()
    const filterFile = files.filter((file: Taro.chooseImage.ImageFile) => {
      if (file.size > maximize) {
        oversizes.push(file)
        return false
      }
      return true
    })
    if (oversizes.length) {
      onOversize && onOversize(files)
    }

    const currentFileLength = filterFile.length + fileList.length
    if (currentFileLength > maximum) {
      filterFile.splice(filterFile.length - (currentFileLength - maximum))
    }
    return filterFile
  }

  const onDelete = (file: FileItem, index: number) => {
    clearUploadQueue(index)
    if (onBeforeDelete && onBeforeDelete(file, fileList)) {
      fileList.splice(index, 1)
      onRemove && onRemove(file, fileList)
      setFileList([...fileList])
    } else {
      console.log(locale.uploader.deleteWord)
    }
  }

  const onChangeFn = (res: Taro.chooseImage.SuccessCallbackResult) => {
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    const { tempFiles } = res
    if (onBeforeUpload) {
      onBeforeUpload(tempFiles).then((f: Array<Taro.chooseImage.ImageFile>) => {
        const _files: Taro.chooseImage.ImageFile[] = filterFiles(f)
        readFile(_files)
      })
    } else {
      const _files: Taro.chooseImage.ImageFile[] = filterFiles(tempFiles)
      readFile(_files)
    }

    onChange && onChange({ fileList })
  }

  const handleItemClick = (file: FileItem) => {
    onFileItemClick && onFileItemClick(file)
  }

  return (
    <div className={classes} {...restProps}>
      {children && (
        <div className="nut-uploader__slot">
          <>
            {children}
            {maximum > fileList.length && (
              <Button className="nut-uploader__input" onClick={_chooseImage} />
            )}
          </>
        </div>
      )}

      {fileList.length !== 0 &&
        fileList.map((item: any, index: number) => {
          return (
            <div className={`nut-uploader__preview ${listType}`} key={item.uid}>
              {listType === 'picture' && !children && (
                <div className="nut-uploader__preview-img">
                  {isDeletable && (
                    <Icon
                      classPrefix={iconClassPrefix}
                      fontClassName={iconFontClassName}
                      color="rgba(0,0,0,0.6)"
                      className="close"
                      name="failure"
                      onClick={() => onDelete(item, index)}
                    />
                  )}
                  {item.status === 'ready' ? (
                    <div className="nut-uploader__preview__progress">
                      <div className="nut-uploader__preview__progress__msg">
                        {item.message}
                      </div>
                    </div>
                  ) : (
                    item.status !== 'success' && (
                      <div className="nut-uploader__preview__progress">
                        {item.failIcon === ' ' ||
                        item.loadingIcon === ' ' ? null : (
                          <Icon
                            classPrefix={iconClassPrefix}
                            fontClassName={iconFontClassName}
                            color="#fff"
                            name={`${
                              item.status === 'error'
                                ? `${item.failIcon || 'failure'}`
                                : `${item.loadingIcon || 'loading'}`
                            }`}
                          />
                        )}
                        <div className="nut-uploader__preview__progress__msg">
                          {item.message}
                        </div>
                      </div>
                    )
                  )}
                  {item.type.includes('image') ? (
                    <>
                      {item.url && (
                        <img
                          className="nut-uploader__preview-img__c"
                          src={item.url}
                          alt=""
                          onClick={() => handleItemClick(item)}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {defaultImg ? (
                        <img
                          className="nut-uploader__preview-img__c"
                          src={defaultImg}
                          alt=""
                          onClick={() => handleItemClick(item)}
                        />
                      ) : (
                        <div className="nut-uploader__preview-img__file">
                          <div
                            onClick={() => handleItemClick(item)}
                            className="nut-uploader__preview-img__file__name"
                          >
                            <Icon
                              classPrefix={iconClassPrefix}
                              fontClassName={iconFontClassName}
                              color="#808080"
                              name="link"
                            />
                            &nbsp;
                            {item.name}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {item.status === 'success' ? (
                    <div className="tips">{item.name}</div>
                  ) : null}
                </div>
              )}

              {listType === 'list' && (
                <div className="nut-uploader__preview-list">
                  <div
                    className={`nut-uploader__preview-img__file__name ${item.status}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <Icon
                      classPrefix={iconClassPrefix}
                      fontClassName={iconFontClassName}
                      name="link"
                    />
                    &nbsp;{item.name}
                  </div>
                  {isDeletable && (
                    <Icon
                      classPrefix={iconClassPrefix}
                      fontClassName={iconFontClassName}
                      color="#808080"
                      className="nut-uploader__preview-img__file__del"
                      name="del"
                      onClick={() => onDelete(item, index)}
                    />
                  )}
                  {item.status === 'uploading' && (
                    <Progress
                      size="small"
                      percentage={item.percentage}
                      strokeColor="linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(32,147,255,1) 32.815625%,rgba(13,242,204,1) 100%)"
                      showText={false}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}

      {maximum > fileList.length && listType === 'picture' && !children && (
        <div
          className={`nut-uploader__upload ${listType} ${
            disabled ? 'nut-uploader__upload-disabled' : ''
          }`}
        >
          <div className="nut-uploader__icon">
            <Icon
              classPrefix={iconClassPrefix}
              fontClassName={iconFontClassName}
              size={uploadIconSize}
              color="#808080"
              name={uploadIcon}
            />
            <span className="nut-uploader__icon-tip">{uploadIconTip}</span>
          </div>
          <Button className="nut-uploader__input" onClick={_chooseImage} />
        </div>
      )}
    </div>
  )
}

export const Uploader = React.forwardRef(InternalUploader)

Uploader.defaultProps = defaultProps
Uploader.displayName = 'NutUploader'
