/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'components/Modal';
import { Language } from 'application/Models/Language';
import { get } from 'core/Utils/Storage';
import { SearchItem } from 'application/Models/SearchItem';
import Consts from 'application/Const';
import { Filter, File } from 'core/Utils/File';
import { DictActions } from 'application/DictRedux';
import { RootState } from 'core/Store';
import type { IModalRef } from 'components/Modal';

const Config: React.FC = () => {
    const dispatch = useDispatch();
    const initialLanguages = useSelector((state: RootState) => state.dict.languages);

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
        dispatch(DictActions.UpdateSearchItem([]) as any);
        await dispatch(DictActions.ToggleSetting() as any);
    }, [dispatch]);

    const exportWords = React.useCallback(async () => {
        const fs = window.require('fs-extra');
        const searchItems = await get<Array<SearchItem>>(Consts.searchItems, []);
        if (searchItems) {
            const fileName = await File.openFile('SaveWords', 'WordList', Filter.csv);
            if (!fileName) {
                return false;
            }
            await fs.appendFileSync(fileName, Buffer.from(`\uFEFF`));

            for (let index = 0; index < searchItems.length; index++) {
                const element = searchItems[index];
                if (SearchItem.isPhrase(element.words) === false) {
                    await fs.appendFileSync(fileName, Buffer.from(`${element.words.map(x => x.text).join(";")}\r\n`));
                }
            }
            alert('Words have saved in ' + fileName);
            await dispatch(DictActions.ToggleSetting() as any);
        }
    }, [dispatch]);

    const openHowToUse = React.useCallback(async () => {
        const { shell } = window.require('electron');
        const url = 'https://bryht.github.io/dian';
        shell.openExternal(url);
        await dispatch(DictActions.ToggleSetting() as any);
    }, [dispatch]);

    const onUsedLanguageChange = React.useCallback((culture: string, newIsUsed: boolean) => {
        setLanguages(prevLanguages => {
            // Check if we would have at least 2 languages after this change
            const wouldHaveTwoLanguages = prevLanguages.filter(p => 
                p.culture === culture ? newIsUsed : p.isUsed
            ).length >= 2;
            
            if (!wouldHaveTwoLanguages) {
                alert('Need choose at least 2 language');
                return prevLanguages; // Return unchanged
            }

            return prevLanguages.map(item => {
                if (item.culture === culture) {
                    return { ...item, isUsed: newIsUsed };
                }
                return item;
            });
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
                DeleteAll
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={openHowToUse}>
                How To Use
            </button >
            <Modal ref={modalRef} onModalClosed={modalClosed}>
                <h5>Config language and detail link</h5>
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