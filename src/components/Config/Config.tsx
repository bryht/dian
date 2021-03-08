/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import Modal from 'components/Modal/Modal';
import { Language, languages } from 'core/Models/Language';
import { get } from 'utils/Storage';

export interface IConfigProps extends BasicProps {
}

class Config extends RootComponent<IConfigProps, { languages: Array<Language> }>  {

    modalRef: React.RefObject<Modal>;

    constructor(props: Readonly<IConfigProps>) {
        super(props);
        this.modalRef = React.createRef<Modal>();
        this.state = {
            languages: []
        }
    }

    async componentDidMount() {
        const items = await get<Array<Language>>('languages', languages);
        this.setState({ languages: items ?? [] })
    }

    openSetting = () => {
        this.modalRef.current?.openModal();
    }

    openHowToUse = () => {

    }

    openLink = (culture: string) => {
        const { languages } = this.state;
        languages.forEach(item => {
            item.isSelected = item.culture === culture;
        });

        this.setState({ languages });
    }

    saveConfig = () => {

        this.modalRef.current?.closeModal();
    }

    public render() {
        const { languages } = this.state;
        const selected = languages.find(p => p.isSelected);
        return (
            <div className="btn-group-vertical">
                <button type="button" className="btn btn-secondary" onClick={this.openSetting}>
                    Setting
                </button>
                <button type="button" className="btn btn-warning" onClick={this.openHowToUse}>
                    How To Use
                </button >
                <Modal ref={this.modalRef}>
                    <ul className="nav nav-tabs">
                        {
                            languages.map(item => <li className="nav-item">
                                <a className={`nav-link ${item.isSelected && 'active'}`} onClick={() => this.openLink(item.culture)} href="#">{item.cultureName}</a>
                            </li>)
                        }
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">New</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Working on it</a></li>
                            </ul>
                        </li>
                    </ul>
                    <div className="card w-100 border-top-0">
                        <div className="card-body d-flex flex-column">
                            <div className="m-2">
                                <label htmlFor="link">detail click link:</label>
                                <input type="text" className="form-control" id="link" value={selected?.detailLink}></input>
                            </div>
                            <div className="m-2">
                                <label htmlFor="top">detail hide top:</label>
                                <input type="number" className="form-control" id="top" value={selected?.detailHideTop}></input>
                            </div>
                            <div className="m-2">
                                <label htmlFor="link">detail hider filters:</label>
                                <input type="text" className="form-control" id="link" value={selected?.detailHideFilters}></input>
                            </div>
                            <button type="button" onClick={this.saveConfig} className="btn btn-primary m-2 align-self-end">Close</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default connect(mapRootStateToProps)(Config);