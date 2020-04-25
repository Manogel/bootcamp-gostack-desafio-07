import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';
import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  id: string;
  file: File;
  name: string;
  readableSize: string;
  updateProgress: number;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  function updateProgressFile(id: string, progress: number): void {
    setUploadedFiles(
      uploadedFiles.map(file =>
        file.id === id ? { ...file, updateProgress: progress } : file,
      ),
    );
  }

  async function processUpload(upaloadedFile: FileProps): Promise<void> {
    const data = new FormData();
    data.append('file', upaloadedFile.file);

    try {
      await api.post('/transactions/import', data, {
        onUploadProgress: e => {
          const progress = Math.round((e.loaded / e.total) * 100);
          updateProgressFile(upaloadedFile.id, progress);
        },
      });
    } catch (err) {
      console.log(err.response.error);
    }
  }

  async function handleUpload(): Promise<void> {
    uploadedFiles.forEach(processUpload);
  }

  function submitFile(files: File[]): void {
    const filesData = files.map(file => ({
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      file,
      updateProgress: 0,
    }));
    setUploadedFiles(filesData);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
