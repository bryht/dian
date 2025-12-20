/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'components/Modal';
import { Language } from 'application/Models/Language';
import { SearchItem } from 'application/Models/SearchItem';
import { Filter, File } from 'core/Utils/File';
import { DictActions } from 'application/DictRedux';
import { RootState } from 'core/Store';
import type { IModalRef } from 'components/Modal';

const Config: React.FC = () => {
    const dispatch = useDispatch();
    const initialLanguages = useSelector((state: RootState) => state.dict.languages);
    const searchItems = useSelector((state: RootState) => state.dict.searchItems ?? []);

    const modalRef = React.useRef<IModalRef>(null);
    const [languages, setLanguages] = React.useState<Array<Language>>(initialLanguages);

    React.useEffect(() => {
        dispatch(DictActions.LoadLanguages() as any);
    }, [dispatch]);

    React.useEffect(() => {
        setLanguages(initialLanguages);
    }, [initialLanguages]);

    const openSetting = React.useCallback(async () => {
        await dispatch(DictActions.LoadLanguages() as any);
        modalRef.current?.openModal();
    }, [dispatch]);

    const deleteSearchItems = React.useCallback(async () => {
        if (!searchItems || searchItems.length === 0) {
            alert('No search history to delete.');
            return;
        }
        
        if (window.confirm(`Are you sure you want to delete all ${searchItems.length} search history items? This action cannot be undone.`)) {
            dispatch(DictActions.UpdateSearchItem([]) as any);
            await dispatch(DictActions.ToggleSetting() as any);
        }
    }, [dispatch, searchItems]);

    const exportWords = React.useCallback(async () => {
        if (!searchItems || searchItems.length === 0) {
            alert('No search history available to export. Please search for some words first.');
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            const fileName = await File.openFile('SaveWords', 'WordList', Filter.csv);
            
            if (!fileName) {
                return;
            }
            
            const filteredItems = searchItems.filter(element => !SearchItem.isPhrase(element.words));
            
            if (filteredItems.length === 0) {
                alert(`All ${searchItems.length} items are phrases and cannot be exported. Only individual words can be exported.`);
                await dispatch(DictActions.ToggleSetting() as any);
                return;
            }
            
            const csvData = filteredItems
                .map(element => element.words.map(x => x.text).join(";"))
                .join("\r\n") + "\r\n";
            
            const result = await ipcRenderer.invoke('export-words', { fileName, csvData });
            
            if (result.success) {
                alert(`Successfully exported ${filteredItems.length} word(s) to:\n${fileName}`);
            } else {
                alert(`Failed to export words: ${result.error || 'Unknown error'}`);
            }
            
            await dispatch(DictActions.ToggleSetting() as any);
        } catch (error) {
            console.error('Error exporting words:', error);
            alert(`An error occurred while exporting: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [searchItems, dispatch]);

    const openHowToUse = React.useCallback(async () => {
        try {
            const { ipcRenderer } = window.require('electron');
            const url = 'https://bryht.github.io/dian';
            await ipcRenderer.invoke('open-external-url', url);
            await dispatch(DictActions.ToggleSetting() as any);
        } catch (error) {
            console.error('Error opening external URL:', error);
            alert('Failed to open documentation. Please visit https://bryht.github.io/dian manually.');
        }
    }, [dispatch]);

    const onUsedLanguageChange = React.useCallback((culture: string, newIsUsed: boolean) => {
        setLanguages(prevLanguages => {
            // Check if we would have at least 2 languages after this change
            const activeLanguagesCount = prevLanguages.filter(p => 
                p.culture === culture ? newIsUsed : p.isUsed
            ).length;
            
            if (activeLanguagesCount < 2) {
                alert('Please select at least 2 languages.');
                return prevLanguages;
            }

            return prevLanguages.map(item => 
                item.culture === culture 
                    ? { ...item, isUsed: newIsUsed } 
                    : item
            );
        });
    }, []);

    const onLanguageDetailLinkChanged = React.useCallback((culture: string, value: string) => {
        setLanguages(prevLanguages => {
            return prevLanguages.map(item => ({
                ...item,
                isSelected: item.culture === culture,
                detailLink: item.culture === culture ? value : item.detailLink
            }));
        });
    }, []);

    const saveConfig = React.useCallback(async () => {
        await dispatch(DictActions.UpdateLanguages(languages) as any);
        modalRef.current?.closeModal();
    }, [languages, dispatch]);

    const resetConfig = React.useCallback(async () => {
        await dispatch(DictActions.UpdateLanguages([]) as any);
        await dispatch(DictActions.LoadLanguages() as any);
        modalRef.current?.closeModal();
    }, [dispatch]);

    const modalClosed = React.useCallback(async () => {
        await dispatch(DictActions.ToggleSetting() as any);
    }, [dispatch]);


    const selectedLanguage = languages.find(p => p.isSelected);

    if (!selectedLanguage) {
        return null;
    }

    return (
        <div className="btn-group-vertical">
            <button type="button" className="btn btn-outline-secondary" onClick={openSetting}>
                Setting
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={exportWords}>
                Export
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={deleteSearchItems}>
                ClearAll
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={openHowToUse}>
                Document
            </button >
            <Modal ref={modalRef} onModalClosed={modalClosed}>
                <h5>Configure Languages and Dictionary Links</h5>
                <div className="d-flex flex-wrap">
                    {
                        languages.map(l =>
                            l.isUsed ?
                                <div key={l.culture} className="input-group mb-1">
                                    <div className="input-group-text">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" onChange={e => onUsedLanguageChange(l.culture, e.currentTarget.checked)} checked={l.isUsed}></input>
                                            <label className="form-check-label">{l.cultureName}</label>
                                        </div>
                                    </div>
                                    <input type="text" className="form-control" onChange={e => onLanguageDetailLinkChanged(l.culture, e.target.value)} value={l.detailLink}></input>
                                </div>
                                :
                                <div key={l.culture} className="m-1">
                                    <div className="input-group-text">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" onChange={e => onUsedLanguageChange(l.culture, e.currentTarget.checked)} checked={l.isUsed}></input>
                                            <label className="form-check-label">{l.cultureName}</label>
                                        </div>
                                    </div>
                                </div>

                        )
                    }
                </div>
                <div className="d-flex justify-content-end">
                    <button type="button" onClick={resetConfig} className="btn btn-secondary m-2 align-self-end">Reset</button>
                    <button type="button" onClick={saveConfig} className="btn btn-secondary m-2 align-self-end">Save</button>
                </div>
            </Modal>
        </div>
    );
};

export default Config;