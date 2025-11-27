import { useCallback, useEffect, useState } from 'react';
import JSZip from "jszip";

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
  const [exportProgress, setExportProgress] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [importProgress, setImportProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [savingFrequency, setSavingFrequency] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const [typesRes, domainsRes, frequencyRes] = await Promise.all([
        api.get('/types-of-publication'),
        api.get('/domains'),
        api.get('/domains/system-setting/backup_frequency')
      ]);

      // Mapa de conversão EN/PT
      const frequencyMap = {
        "daily": "Diário",
        "weekly": "Semanal",
        "monthly": "Mensal",
      };

      const portugueseValue = frequencyMap[frequencyRes.data.value];

      setTypes(typesRes.data || []);
      setDomains(domainsRes.data || []);
      setSelectedFrequency({id: frequencyRes.id, name: portugueseValue } || []);
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
      setExportProgress(0);
      toast.info('Iniciando exportação...');

      // Inicia exportação
      const exportPromise = api.get(`/domains/export`, {
        params: {
          domain_id: selectedDomain?.id,
          type_of_publication_id: selectedType?.id,
        },
        responseType: "blob",
      });

      // Enquanto o backend está exportando, polling:
      const interval = setInterval(async () => {
        try {
          const progressRes = await api.get('/domains/export-progress') ?? 0;
          setExportProgress(progressRes.data.progress);
        } catch {}
      }, 500);

      const responseExport = await exportPromise;

      clearInterval(interval);
      setExportProgress(100);

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
      toast.error('Erro na exportação.');
    } finally {
      setExporting(false);

      // Resetar progress bar depois de uns segundos
      setTimeout(() => setExportProgress(null), 2000);
    }
  }, [selectedDomain, selectedType]);

  const handleFilesChange = useCallback(async (fileList) => {
      if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
          toast.error("Selecione um arquivo ZIP");
          return;
      }

      const realFile = fileList[0].file;

      if (!(realFile instanceof File)) {
          toast.error("Erro: arquivo inválido.");
          return;
      }

      let loadingToast;

      try {
        loadingToast = toast.loading("Processando arquivo ZIP...");

        const zip = await JSZip.loadAsync(realFile);

        const sqlFile = zip.file("database_export.sql");

        if (!sqlFile) {
            toast.update(loadingToast, {
                render: "database_export.sql não encontrado.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }

        const sqlContent = await sqlFile.async("blob");

        const formData = new FormData();
        formData.append("file", sqlContent, "database_export.sql");

        const response = await api.post(
            "/domains/import/preview",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        toast.update(loadingToast, {
            render: "Preview gerado com sucesso!",
            type: "success",
            isLoading: false,
            autoClose: 3000
        });
        
        setPreviewInfo(response.data.summary);

      } catch (error) {
        console.error(error);
        toast.update(loadingToast, {
            render: "Erro ao processar importação.",
            type: "error",
            isLoading: false,
            autoClose: 3000
        });
      }

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

  const handleSaveFrequency = useCallback(async () => {
    if (!selectedFrequency) {
      toast.warn("Selecione uma frequência.");
      return;
    }

    try {
      setSavingFrequency(true);

      // Mapa de conversão PT/EN
      const frequencyMap = {
        "Diário": "daily",
        "Semanal": "weekly",
        "Mensal": "monthly",
      };

      const englishValue = frequencyMap[selectedFrequency.name];

      if (!englishValue) {
        toast.error("Frequência inválida.");
        return;
      }

      const payload = {
        key: "backup_frequency",
        value: englishValue,
      };

      const updateFrequency = await api.put(`/domains/system-settings`, payload);

      toast.success(updateFrequency.data.message || "Frequência salva com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro na configuração da frequência de backup.");
    } finally {
      setSavingFrequency(false);
    }
  }, [selectedFrequency]);

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
    
      {filtersLoading ? (
        <LoadingSpinner loading={true} />
      ) : (
      <Container>
        <Row>
          {/* EXPORTAR */}
          <Section title="Exportar Dados">
            <p>Selecione o que deseja exportar do sistema.</p>
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

                {exportProgress !== null && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ width: "100%", background: "#ddd", height: 10, borderRadius: 5 }}>
                      <div
                        style={{
                          width: `${exportProgress}%`,
                          height: "100%",
                          background: "#2196f3",
                          borderRadius: 5,
                          transition: "0.3s"
                        }}
                      ></div>
                    </div>
                    <div style={{ fontSize: 12 }}>{exportProgress}%</div>
                  </div>
                )}
              </>
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
              <Button title="Salvar configuração" onClick={handleSaveFrequency} loading={savingFrequency} />
            </Actions>
          </Section>
        </Row>

        <Row>
          {/* IMPORTAR */}
          <Section title="Importar Dados">
            <p style={{ marginBottom: 12 }}>
              Selecione um arquivo de backup (.zip) para importar.
            </p>

            <Uploads onFilesChange={handleFilesChange} main />

            {previewInfo && (
              <Preview style={{ marginTop: 12 }}>
                
                <h3>Resumo da Importação</h3>

                {/* Total geral */}
                <div style={{ marginBottom: 10 }}>
                  <strong>Total de publicações:</strong> {previewInfo.total_publications}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <strong>Total de usuários:</strong> {previewInfo.users}
                </div>

                {/* Domínios */}
                <div style={{ marginTop: 15 }}>
                  <strong>Domínios:</strong>
                  <ul>
                    {previewInfo.domains.map(domain => (
                      <li key={domain.id}>
                        {domain.name} — {domain.publication_records} registros
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tipos de publicação */}
                <div style={{ marginTop: 15 }}>
                  <strong>Tipos de Publicação:</strong>
                  <ul>
                    {previewInfo.types_of_publication.map(tp => (
                      <li key={tp.id}>
                        {tp.name} — {tp.publication_records} registros
                      </li>
                    ))}
                  </ul>
                </div>

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
      )}
    </Fixed>
  );
}

export default Backup;
