import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { useRef, useState } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

import { storage } from '../../gateways/firebase';
import cssClasses from './UploadFile.module.css';

registerPlugin(
  FilePondPluginImagePreview, 
  FilePondPluginImageResize, 
  FilePondPluginImageExifOrientation, 
  FilePondPluginFileValidateType
);

export function UploadFile({ setReferenceFilePath }: { setReferenceFilePath: (path?: string) => void }) {
  const pondRef = useRef<FilePond>(null);
  const [file, setFile] = useState<File>();
  const [uploadTask, uploadTaskState] = useUploadFile();

  function handleInit() {
    console.log("FilePond instance has initialised", pondRef.current);
  }

  function handleProcessing(fieldName, file ) {
console.log({fieldName, file });

    // setFile(file);
    upload(file)
  }

  function upload(file: File) {
    const uploadTask = uploadBytesResumable(storageRef(storage, `products/${file?.name}`), file as Blob);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, (error) => {
      console.error(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setReferenceFilePath(downloadURL);
      });
    })

    pondRef.current?.removeFiles();
  }

  return (
    <div className="form-item-upload">
      <FilePond
        ref={pondRef}
        allowMultiple={false}
        server={{ process: handleProcessing }}
        oninit={handleInit}
        allowImageResize
        imageResizeTargetWidth={320}
        allowImageExifOrientation
        acceptedFileTypes={['image/*']}
        instantUpload
      />
      <a className={cssClasses.uploadBtn + ' my-btn'} onClick={upload}>A foto ficou boa? <br/>Clique aqui para gravar</a>
    </div>
  )
}
