/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import { Language } from 'application/Models/Language';
import { get, set } from 'core/Utils/Storage';
import { SearchItem } from 'application/Models/SearchItem';
import Consts from 'application/Const';
import { Filter, File } from 'core/Utils/File';
import { DictActions } from 'application/DictRedux';
import { RootState } from 'core/Store';
import Guid from 'core/Utils/Guid';

const fs = window.require('fs-extra');
const { shell } = window.require('electron');

export interface IConfigProps extends BasicProps {
    initialLanguages: Array<Language>;
}

export interface IState {
    languages: Array<Language>;
    syncId: string;
}

class Config extends RootComponent<IConfigProps, IState>  {

    modalRef: React.RefObject<Modal>;
    constructor(props: Readonly<IConfigProps>) {
        super(props);
        this.modalRef = React.createRef<Modal>();
        this.state = {
            languages: this.props.initialLanguages,
            syncId: ''
        }
    }

    async componentDidMount() {
        await this.invokeDispatchAsync(DictActions.LoadLanguages());
        let syncId = await get<string>("sync-id");
        if (!syncId) {
            syncId = Guid.newGuid();
            await set("sync-id", syncId);
        }
        this.setState({ syncId })
    }

    componentDidUpdate(prevProps: IConfigProps, prevState: IState) {
        if (this.props.initialLanguages !== prevProps.initialLanguages &&
            this.props.initialLanguages !== prevState.languages) {
            this.setState({ languages: this.props.initialLanguages })
        }
    }

    openSetting = async () => {
        await this.invokeDispatchAsync(DictActions.LoadLanguages());
        this.modalRef.current?.openModal();
    }

    async deleteSearchItems() {
        this.invokeDispatchAsync(DictActions.UpdateSearchItem([]));
        await this.invokeDispatchAsync(DictActions.ToggleSetting())
    }

    async exportWords() {
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
            await this.invokeDispatchAsync(DictActions.ToggleSetting())
        }
    }

    openHowToUse = async () => {
        const url = 'https://bryht.github.io/dian';
        shell.openExternal(url);
        await this.invokeDispatchAsync(DictActions.ToggleSetting())
    }

    onUsedLanguageChange = (culture: string, checked: boolean) => {
        const { languages } = this.state;
        languages.forEach(item => {
            if (item.culture === culture) {
                item.isUsed = checked;
                if (languages.filter(p => p.isUsed).length < 2) {
                    item.isUsed = true;
                    alert('Need choose at least 2 language');
                }
            }
        });
        this.setState({ languages: [...languages] });
    }

    onLanguageDetailLinkChanged = (culture: string, value: string) => {
        const { languages } = this.state;
        languages.forEach(item => {
            item.isSelected = item.culture === culture;
            if (item.isSelected) {
                item.detailLink = value;
            }
        });
        this.setState({ languages });
    }

    saveConfig = async () => {
        const { languages } = this.state;
        await this.invokeDispatchAsync(DictActions.UpdateLanguages(languages));
        this.modalRef.current?.closeModal();
    }


    resetConfig = async () => {
        await this.invokeDispatchAsync(DictActions.UpdateLanguages([]));
        await this.invokeDispatchAsync(DictActions.LoadLanguages());
        this.modalRef.current?.closeModal();
    }

    modalClosed = async () => {
        await this.invokeDispatchAsync(DictActions.ToggleSetting())
    }


    public render() {
        const { languages, syncId } = this.state;
        const selectedLanguage = languages.find(p => p.isSelected);

        if (!selectedLanguage) {
            return '';
        }

        return (
            <div className="btn-group-vertical">
                <button type="button" className="btn btn-outline-secondary" onClick={() => this.openSetting()}>
                    Setting
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => this.exportWords()}>
                    Export
                </button>
                <button type="button" className="btn btn-outline-danger" onClick={() => this.deleteSearchItems()}>
                    DeleteAll
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => this.openHowToUse()}>
                    How To Use
                </button >
                <Modal ref={this.modalRef} onModalClosed={() => this.modalClosed}>
                    <h5>Config language and detail link</h5>
                    <div className="d-flex flex-wrap">
                        {
                            languages.map(l =>
                                l.isUsed ?
                                    <div key={l.culture} className="input-group mb-1">
                                        <div className="input-group-text">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" onChange={e => this.onUsedLanguageChange(l.culture, e.currentTarget.checked)} checked={l.isUsed}></input>
                                                <label className="form-check-label">{l.cultureName}</label>
                                            </div>
                                        </div>
                                        <input type="text" className="form-control" onChange={e => this.onLanguageDetailLinkChanged(l.culture, e.target.value)} value={l.detailLink}></input>
                                    </div>
                                    :
                                    <div key={l.culture} className="m-1">
                                        <div className="input-group-text">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" onChange={e => this.onUsedLanguageChange(l.culture, e.currentTarget.checked)} checked={l.isUsed}></input>
                                                <label className="form-check-label">{l.cultureName}</label>
                                            </div>
                                        </div>
                                    </div>

                            )
                        }
                    </div>
                    <h5>Sync id</h5>
                    <div>
                        {syncId}
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="button" onClick={this.resetConfig} className="btn btn-secondary m-2 align-self-end">Reset</button>
                        <button type="button" onClick={this.saveConfig} className="btn btn-secondary m-2 align-self-end">Save</button>
                    </div>
                </Modal>
            </div>
        );
    }
}
export function mapStateToProps(state: RootState) {
    return {
        initialLanguages: state.dict.languages,
        ...mapRootStateToProps(state)
    }
}
export default connect(mapStateToProps)(Config);