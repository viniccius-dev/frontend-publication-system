import { useCallback, useEffect, useState } from 'react';

import { Fixed } from '../../components/Fixed';
import { Section } from '../../components/Section';
import { InputSelect } from '../../components/InputSelect';
import { Uploads } from '../../components/Uploads';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

import { api } from '../../services/api';
import { toast } from 'react-toastify';

import { Container, Column, Row, Actions, Preview } from './styles';

export function Backup() {
    const [types, setTypes] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState(null);

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
                api.get('/domains')
            ]);

            console.debug('typesRes', typesRes);
            console.debug('domainsRes', domainsRes);

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
        if(!selectedDomain) {
            toast.info('Selecione um domínio para exportar.');
            return;
        }

            try {
                setExporting(true);
                toast.info('Iniciando exportação...');
                // call the backups export endpoint with selected filters
                const params = new URLSearchParams();
                params.append('domain_id', selectedDomain.id);
                if(selectedType) params.append('type_of_publication_id', selectedType.id || selectedType.name);

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

            toast.success('Exportação concluída com sucesso.');
        } catch (error) {
            console.error(error);
                toast.error('Nenhum dado encontrado ou erro na exportação.');
        } finally {
            setExporting(false);
        }
    }, [selectedDomain]);

    const handleFilesChange = useCallback((files) => {
        setUploadFiles(files);

        // Simple client preview: show filenames and size
        const info = files.map(f => ({ name: f.file.name, size: f.file.size }));
        setPreviewInfo(info);

        // Send file to backend for preview counts
        (async () => {
            try {
                const fd = new FormData();
                fd.append('backup', files[0].file);

                const res = await api.post('/backups/import?preview=true', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // support multiple possible preview shapes returned by backend
                if(res.data) {
                    if(res.data.preview) {
                        setPreviewInfo(prev => ({ ...prev, serverPreview: res.data.preview }));
                    } else if(res.data.summary) {
                        // map summary shape to a minimal serverPreview object
                        const summary = res.data.summary;
                        const serverPreview = {
                            totalFiles: summary.total_publications ? summary.total_publications + (summary.total_attachments || 0) : undefined,
                            counts: {
                                total_publications: summary.total_publications,
                                total_attachments: summary.total_attachments,
                            },
                            details: summary
                        };
                        setPreviewInfo(prev => ({ ...prev, serverPreview }));
                    } else {
                        // unknown shape: attach raw data for inspection
                        setPreviewInfo(prev => ({ ...prev, serverPreview: res.data }));
                    }
                }
            } catch (err) {
                console.error('preview error', err);
                toast.error('Erro ao fazer preview no servidor.');
            }
        })();
    }, []);

    const handleConfirmImport = useCallback(async () => {
        if(uploadFiles.length === 0) {
            toast.info('Selecione um arquivo .zip para importar.');
            return;
        }

        if(!selectedDomain) {
            toast.info('Selecione um domínio para que seja feito o backup antes da importação.');
            return;
        }

            // First: download current backup for selected domain via backups/export
        setExporting(true);
        try {
            const params = new URLSearchParams();
            params.append('domain_id', selectedDomain.id);
            if(selectedType) params.append('type_of_publication_id', selectedType.id || selectedType.name);
            const response = await api.get(`/backups/export?${params.toString()}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `export_${selectedDomain.id}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Erro ao baixar backup antes da importação', err);
            // If export fails, ask user whether to continue
            // If export fails, ask user whether to continue
            const proceed = window.confirm('Falha ao baixar backup do domínio selecionado. Deseja continuar com a importação mesmo assim?');
            if(!proceed) {
                setExporting(false);
                return;
            }
        } finally {
            setExporting(false);
        }

        // Now perform import upload
        setLoading(true);
        setImportProgress(0);
        try {
            const fd = new FormData();
            fd.append('backup', uploadFiles[0].file);

            const res = await api.post('/backups/import', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setImportProgress(percentCompleted);
                }
            });

            // accept either { imported: true } or { message: 'Importação concluída com sucesso' }
            const success = (res.data && (res.data.imported === true || (res.data.message && /sucesso/i.test(res.data.message))));
            if(success) {
                toast.success(res.data.message || 'Importação concluída com sucesso.');
                addLog({ date: new Date().toLocaleString(), type: 'manual', status: 'success', size: uploadFiles[0].file.size });
                setUploadFiles([]);
                setPreviewInfo(null);
            } else {
                toast.error(res.data && res.data.message ? res.data.message : 'Importação finalizada com erro.');
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
    }, [uploadFiles, selectedDomain]);

    // Backup automático settings stored in localStorage for now
    const [frequency, setFrequency] = useState(() => localStorage.getItem('@backup:frequency') || 'never');

    const handleSaveFrequency = useCallback(() => {
    localStorage.setItem('@backup:frequency', frequency);
    toast.success('Frequência de backup atualizada com sucesso!');
    }, [frequency]);

    // Mock logs in localStorage
    const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('@backup:logs') || '[]'));

    const addLog = useCallback((entry) => {
        const next = [entry, ...logs].slice(0, 100);
        setLogs(next);
        localStorage.setItem('@backup:logs', JSON.stringify(next));
    }, [logs]);

    return (
        <Fixed title="Backups" route="/backup">
            <Container>
                <Row>
                    <Column>
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

                                    {types.length === 0 && <div style={{ marginTop: 8, color: '#666' }}>Nenhum tipo de publicação disponível.</div>}

                                    <InputSelect
                                        title="Selecione o domínio"
                                        group="domains"
                                        options={domains}
                                        objectValue="url"
                                        onSelect={setSelectedDomain}
                                        selected={selectedDomain}
                                    />

                                    {domains.length === 0 && <div style={{ marginTop: 8, color: '#666' }}>Nenhum domínio disponível.</div>}

                                    <Actions>
                                        <Button title="Exportar" onClick={handleExport} loading={exporting} disabled={!selectedType || !selectedDomain || exporting} />
                                    </Actions>
                                </>
                            )}
                        </Section>

                        <Section title="Importar Dados">
                            <p>Selecione um arquivo de backup (.zip) para importar.</p>
                            <Uploads onFilesChange={handleFilesChange} />

                            <Preview>
                                {previewInfo ? (
                                    <div>
                                        <ul>
                                            {previewInfo.map((p, i) => (
                                                <li key={i}>{p.name} — {(p.size/1024).toFixed(1)} KB</li>
                                            ))}
                                        </ul>

                                        {previewInfo.serverPreview && (
                                            <div style={{ marginTop: 8 }}>
                                                <strong>Preview do servidor:</strong>
                                                <div>Total de arquivos no ZIP: {previewInfo.serverPreview.totalFiles}</div>
                                                <div>Contagens por tabela:</div>
                                                <ul>
                                                    {Object.entries(previewInfo.serverPreview.counts).map(([table, count]) => (
                                                        <li key={table}>{table}: {count}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>Nenhum arquivo selecionado</div>
                                )}

                                {importProgress > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ width: '100%', background: '#eee', height: 8, borderRadius: 4 }}>
                                            <div style={{ width: `${importProgress}%`, background: '#4caf50', height: '100%', borderRadius: 4 }} />
                                        </div>
                                        <div style={{ fontSize: 12 }}>{importProgress}%</div>
                                    </div>
                                )}
                            </Preview>

                            <Actions>
                                <Button title="Confirmar Importação" onClick={handleConfirmImport} loading={loading} />
                            </Actions>
                        </Section>
                    </Column>

                    <Column>
                        <Section title="Backup Automático">
                            <p>Defina a frequência de backup do sistema.</p>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                                <option value="daily">Diário</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensal</option>
                                <option value="never">Nunca</option>
                            </select>
                            <Actions>
                                <Button title="Salvar configuração" onClick={handleSaveFrequency} />
                            </Actions>
                        </Section>

                        <Section title="Histórico de Backups">
                            <div style={{ maxHeight: 300, overflow: 'auto' }}>
                                {logs.length === 0 ? (
                                    <div>Nenhum backup registrado.</div>
                                ) : (
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
                                                    <td style={{ color: l.status === 'success' ? 'green' : 'red' }}>{l.status}</td>
                                                    <td>{l.size || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Section>
                    </Column>
                </Row>
            </Container>
        </Fixed>
    );
}

export default Backup;
