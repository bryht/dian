/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import { Language } from 'application/Models/Language';
import { get } from 'core/Utils/Storage';
import { SearchItem } from 'application/Models/SearchItem';
import Consts from 'application/Const';
import { Filter, File } from 'core/Utils/File';
import { DictActions } from 'application/DictRedux';
import { RootState } from 'core/Store';
const fs = window.require('fs-extra');
const { shell } = window.require('electron');

export interface IConfigProps extends BasicProps {
    initialLanguages: Array<Language>;
}

export interface IState {
    languages: Array<Language>;
}

class Config extends RootComponent<IConfigProps, IState>  {

    modalRef: React.RefObject<Modal>;
    constructor(props: Readonly<IConfigProps>) {
        super(props);
        this.modalRef = React.createRef<Modal>();
        this.state = {
            languages: this.props.initialLanguages
        }
    }

    async componentDidMount() {
        await this.invokeDispatchAsync(DictActions.LoadLanguages());
    }

    componentDidUpdate(prevProps: IConfigProps, prevState: IState) {
        if (this.props.initialLanguages !== prevProps.initialLanguages &&
            this.props.initialLanguages !== prevState.languages) {
            this.setState({ languages: this.props.initialLanguages })
        }
    }

    openSetting = () => {
        this.modalRef.current?.openModal();
    }

    async deleteSearchItems() {
        this.invokeDispatchAsync(DictActions.UpdateSearchItem([]));
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
        }
    }

    openHowToUse = () => {
        const url = 'https://github.com/bryht/dict/blob/master/README.md';
        shell.openExternal(url);
    }

    onSelectLanguageChanged = (culture: string) => {
        const { languages } = this.state;
        languages.forEach(item => {
            item.isSelected = item.culture === culture;
        });
        this.setState({ languages });
    }

    onUsedLanguageChange = (culture: string, target: any) => {
        const { languages } = this.state;
        languages.forEach(item => {
            if (item.culture === culture) {
                item.isUsed = !target.checked;
            }
        });

        if (languages.filter(p => p.isUsed).length < 2) {
            alert('Need choose at least 2 language');
            return;
        }
        this.setState({ languages });
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
        await this.invokeDispatchAsync(DictActions.ToggleSetting())
    }

    deleteConfig = async () => {
        await this.invokeDispatchAsync(DictActions.UpdateLanguages([]));
        await this.invokeDispatchAsync(DictActions.LoadLanguages());
    }

    public render() {
        const { languages } = this.state;
        const usedLanguages = languages.filter(p => p.isUsed);
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
                <Modal ref={this.modalRef}>
                    <ul className="nav nav-tabs">
                        <li key="config" className="nav-item dropdown">
                            <a className="nav-link text-secondary dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Config</a>
                            <ul className="dropdown-menu">
                                {
                                    languages.map(item => <li key={item.culture}>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" onInput={e => this.onUsedLanguageChange(item.culture, e.target)} checked={item.isUsed}></input>
                                            <label className="form-check-label">{item.cultureName}</label>
                                        </div>
                                    </li>)
                                }

                            </ul>
                        </li>
                        {
                            usedLanguages.map(item =>
                                <li key={item.culture} className="nav-item">
                                    <a className={`nav-link text-secondary ${item.isSelected && 'active'}`} onClick={() => this.onSelectLanguageChanged(item.culture)} href="#">{item.cultureName}</a>
                                </li>)
                        }

                    </ul>
                    <div className="card w-100 border-top-0">
                        <div className="card-body d-flex flex-column">
                            <div className="m-2">
                                <label htmlFor="link">Detail link:</label>
                                <input type="text" className="form-control" id="link" onChange={e => this.onLanguageDetailLinkChanged(selectedLanguage.culture, e.target.value)} value={selectedLanguage.detailLink}></input>
                            </div>
                            <div className="d-flex">
                                <button type="button" onClick={this.deleteConfig} className="btn btn-secondary m-2 align-self-end">Reset</button>
                                <button type="button" onClick={this.saveConfig} className="btn btn-secondary m-2 align-self-end">Save</button>
                            </div>
                        </div>
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