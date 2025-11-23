import { useCallback, useEffect, useState } from 'react';

import { Fixed } from '../../components/Fixed';
import { Section } from '../../components/Section';
import { InputSelect } from '../../components/InputSelect';
import { Uploads } from '../../components/Uploads';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

import { api } from '../../services/api';
import { toast } from 'react-toastify';

import { Container, Row, Actions, Preview } from './styles';

export function Backup() {
  const [types, setTypes] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [importProgress, setImportProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const [typesRes, domainsRes] = await Promise.all([
        api.get('/types-of-publication'),
        api.get('/domains'),
      ]);

      setTypes(typesRes.data || []);
      setDomains(domainsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar filtros.');
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      toast.info('Iniciando exportação...');

      const responseExport = await api.get(`/domains/export`, {
        params: {
          domain_id: selectedDomain?.id,
          type_of_publication_id: selectedType?.id,
        },
        responseType: 'blob'
      });

      const responseLogs = await api.get(`/domains/backup-logs`);

      const url = window.URL.createObjectURL(new Blob([responseExport.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', responseLogs.data[0].file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Exportação concluída com sucesso.');
    } catch (error) {
      console.error(error);
      toast.error('Nenhum dado encontrado ou erro na exportação.');
    } finally {
      setExporting(false);
    }
  }, [selectedDomain, selectedType]);

  const handleFilesChange = useCallback((files) => {
    setUploadFiles(files);

    
    const info = files.map((f) => ({ name: f.file.name, size: f.file.size }));
    setPreviewInfo(info);
    (async () => {
      try {
        const fd = new FormData();
        fd.append('backup', files[0].file);

        // const res = await api.post('/backups/import?preview=true', fd, {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        // });

        const res = {
  "message": "Preview gerado com sucesso",
  "summary": {
    "domains": [
        {
            "name": "Prefeitura de Xique Xique",
            "publication_records": 1821,
            "attachment_records": 2403
        },
        {
            "name": "Câmara de João Pessoa",
            "publication_records": 1164,
            "attachment_records": 1152
        }
    ],
    "types_of_publication": [
        {
            "name": "Leis Complementares",
            "publication_records": 905,
            "attachment_records": 1107
        },
        {
            "name": "Requerimentos",
            "publication_records": 592,
            "attachment_records": 698
        },
        {
            "name": "Portarias",
            "publication_records": 1488,
            "attachment_records": 1750
        }
    ],
    "total_publications": 2985,
    "total_attachments": 3555,
    "users": 6
  }
}

        if (res.data) {
          if (res.data.preview) {
            setPreviewInfo((prev) => ({ ...prev, serverPreview: res.data.preview }));
          } else if (res.data.summary) {
            const summary = res.data.summary;
            const serverPreview = {
              totalFiles:
                summary.total_publications +
                (summary.total_attachments || 0),
              counts: {
                total_publications: summary.total_publications,
                total_attachments: summary.total_attachments,
              },
              details: summary,
            };
            setPreviewInfo((prev) => ({ ...prev, serverPreview }));
          } else {
            setPreviewInfo((prev) => ({ ...prev, serverPreview: res.data }));
          }
        }
      } catch (err) {
        console.error('preview error', err);
        toast.error('Erro ao fazer preview no servidor.');
      }
    })();
  }, []);

  const handleConfirmImport = useCallback(async () => {
    if (uploadFiles.length === 0) {
      toast.info('Selecione um arquivo .zip para importar.');
      return;
    }

    if (!selectedDomain) {
      toast.info('Selecione um domínio para que seja feito o backup antes da importação.');
      return;
    }

    // Primeiro faz o backup antes da importação
    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('domain_id', selectedDomain.id);
      if (selectedType)
        params.append('type_of_publication_id', selectedType.id || selectedType.name);
      const response = await api.get(`/backups/export?${params.toString()}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_${selectedDomain.id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao baixar backup antes da importação', err);
      const proceed = window.confirm(
        'Falha ao baixar backup do domínio selecionado. Deseja continuar com a importação mesmo assim?'
      );
      if (!proceed) {
        setExporting(false);
        return;
      }
    } finally {
      setExporting(false);
    }

    // Agora realiza a importação
    setLoading(true);
    setImportProgress(0);
    try {
      const fd = new FormData();
      fd.append('backup', uploadFiles[0].file);

      const res = await api.post('/backups/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImportProgress(percentCompleted);
        },
      });

      const success =
        res.data &&
        (res.data.imported === true ||
          (res.data.message && /sucesso/i.test(res.data.message)));
      if (success) {
        toast.success(res.data.message || 'Importação concluída com sucesso.');
        addLog({
          date: new Date().toLocaleString(),
          type: 'manual',
          status: 'success',
          size: uploadFiles[0].file.size,
        });
        setUploadFiles([]);
        setPreviewInfo(null);
      } else {
        toast.error(res.data?.message || 'Importação finalizada com erro.');
        addLog({ date: new Date().toLocaleString(), type: 'manual', status: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro na importação.');
      addLog({ date: new Date().toLocaleString(), type: 'manual', status: 'error' });
    } finally {
      setLoading(false);
      setImportProgress(0);
    }
  }, [uploadFiles, selectedDomain, selectedType]);

  const [frequency, setFrequency] = useState(
    () => localStorage.getItem('@backup:frequency') || 'daily'
  );

  const handleSaveFrequency = useCallback(() => {
    localStorage.setItem('@backup:frequency', frequency);
    toast.success('Frequência de backup atualizada com sucesso!');
  }, [frequency]);

  const [logs, setLogs] = useState(() =>
    JSON.parse(localStorage.getItem('@backup:logs') || '[]')
  );

  const addLog = useCallback(
    (entry) => {
      const next = [entry, ...logs].slice(0, 100);
      setLogs(next);
      localStorage.setItem('@backup:logs', JSON.stringify(next));
    },
    [logs]
  );

  return (
    <Fixed title="Backups" route="/backup">
      <Container>
        <Row>
          {/* EXPORTAR */}
          <Section title="Exportar Dados">
            <p>Selecione o que deseja exportar do sistema.</p>
            {filtersLoading ? (
              <LoadingSpinner loading={true} />
            ) : (
              <>
                <InputSelect
                  title="Selecione o tipo de publicação"
                  group="types"
                  options={types}
                  objectValue="name"
                  onSelect={setSelectedType}
                  selected={selectedType}
                />

                <InputSelect
                  title="Selecione o domínio"
                  group="domains"
                  options={domains}
                  objectValue="url"
                  onSelect={setSelectedDomain}
                  selected={selectedDomain}
                />

                <Actions>
                  <Button
                    title="Exportar"
                    onClick={handleExport}
                    loading={exporting}
                    // disabled={!selectedDomain || exporting}
                  />
                </Actions>
              </>
            )}
          </Section>


          {/* BACKUP AUTOMÁTICO */}
          <Section title="Backup Automático">
            <p>Defina a frequência de backup do sistema.</p>
            <InputSelect
              title="Selecione a frequência"
              group="frequency"
              options={[{id: 1, name: "Diário"}, {id: 2, name: "Semanal"}, {id: 3, name: "Mensal"}]}
              objectValue="name"
              onSelect={setSelectedFrequency}
              selected={selectedFrequency}
            />
            <Actions>
              <Button title="Salvar configuração" onClick={handleSaveFrequency} />
            </Actions>
          </Section>
        </Row>

        <Row>
          {/* IMPORTAR */}
          <Section title="Importar Dados">
            <p style={{ marginBottom: 12 }}>
              Selecione um arquivo de backup (.zip) para importar.
            </p>

            <Uploads onFilesChange={handleFilesChange} />

            {previewInfo && (
              <Preview style={{ marginTop: 12 }}>
                <ul>
                  {previewInfo.map((p, i) => (
                    <li key={i}>
                      {p.name} — {(p.size / 1024).toFixed(1)} KB
                    </li>
                  ))}
                </ul>

                {previewInfo.serverPreview && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Preview do servidor:</strong>
                    <div>Total de arquivos no ZIP: {previewInfo.serverPreview.totalFiles}</div>
                    <div>Contagens por tabela:</div>
                    <ul>
                      {Object.entries(previewInfo.serverPreview.counts).map(([table, count]) => (
                        <li key={table}>
                          {table}: {count}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Preview>
            )}

            {importProgress > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ width: '100%', background: '#eee', height: 8, borderRadius: 4 }}>
                  <div
                    style={{
                      width: `${importProgress}%`,
                      background: '#4caf50',
                      height: '100%',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div style={{ fontSize: 12 }}>{importProgress}%</div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <Button
                title="Confirmar Importação"
                onClick={handleConfirmImport}
                loading={loading}
                style={{ maxWidth: 240, width: '100%' }}
              />
            </div>
          </Section>

          <Section title="Histórico de Backups">
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {logs.length > 0 && (
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Tamanho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l, idx) => (
                      <tr key={idx}>
                        <td>{l.date}</td>
                        <td>{l.type}</td>
                        <td style={{ color: l.status === 'success' ? 'green' : 'red' }}>
                          {l.status}
                        </td>
                        <td>{l.size || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Section>
        </Row>
      </Container>
    </Fixed>
  );
}

export default Backup;
