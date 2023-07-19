import { ref as storageRef } from 'firebase/storage';
import { useState } from 'react';
import Resizer from "./Resizer";
import { useUploadFile } from 'react-firebase-hooks/storage';
import { storage } from '../../gateways/firebase';
import cssClasses from './UploadFile.module.css';
import { toast } from 'react-toastify';
import { Loading } from '../Loading/Loading';

export function UploadFile({ setReferenceFilePath }: { setReferenceFilePath: (path?: string) => void }) {
  const [uploadFile, uploadingFile] = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewFile, setPreviewFile] = useState('');
  const ref = storageRef(storage, `products/${selectedFile?.name}`);

  const upload = async () => {
    if (selectedFile) {
      const result = await uploadFile(ref, selectedFile, {
        contentType: 'image/jpeg'
      });

      setReferenceFilePath(result?.ref.toString());
      setSelectedFile(undefined);
      setPreviewFile('');
      toast.success('Foto cadastrado com sucesso!');
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const resizedFile = await resizeFile(event.target.files[0]) as File;
      setSelectedFile(resizedFile);
      setPreviewFile(URL.createObjectURL(resizedFile));
    }
  }

  return (
    <div className="form-item-upload">
      <label className={cssClasses.myCustomInputUpload} htmlFor="photo">Clique aqui para incluir uma nova imagem:</label>
      <input className={cssClasses.myInputUpload} accept=".jpg, .jpeg, .png" type="file" name="photo" id="photo" onChange={handleFileChange} />
      {previewFile && (
        <>
          <div className={cssClasses.uploadPreview}>
            {uploadingFile && <Loading />}
            <img height={150} src={previewFile} alt="product" />
          </div>
          <a className={cssClasses.uploadBtn + ' my-btn'} onClick={upload}>A foto ficou boa? <br/>Clique aqui para gravar</a>
        </>
      )}
    </div>
  )
}

function resizeFile(file: File): Promise<string | File | Blob | ProgressEvent<FileReader>> {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "WEBP",
      100,
      0,
      (uri: string) => {
        return resolve(uri);
      },
      "file",
    );
  });
}
