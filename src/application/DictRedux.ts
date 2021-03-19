import { Language, languages } from "application/Models/Language";
import { StorageType } from "core/Models/StorageType";
import { Reducer } from "redux";
import { StatesAction } from "core/Actions/StatesAction";
import { StorageAction } from "core/Actions/StorageAction";
import Consts from "./Const";
import { SearchItem } from "./Models/SearchItem";

export class DictStates {
    isSettingOpened: boolean = false;
    searchItems: Array<SearchItem> = [];
    languages: Array<Language> = [];
}

export enum DictActionType {
    ToggleSetting = 'ToggleSetting',
    LoadSearchItems = 'LoadSearchItems',
    UpdateSearchItems = 'UpdateSearchItems',
    LoadLanguages = 'LoadLanguages',
    UpdateLanguages = 'UpdateLanguages'
}

export class DictActions {

    static ToggleSetting(): StatesAction<DictActionType> {
        return {
            type: DictActionType.ToggleSetting,
            payload: null
        }
    }

    static LoadSearchItems(): StorageAction<DictActionType> {
        return new StorageAction(Consts.searchItems, StorageType.Get, [], (result) => {
            return ({
                type: DictActionType.LoadSearchItems,
                payload: result
            })
        })
    }

    static UpdateSearchItem(items: Array<SearchItem>): StorageAction<DictActionType> {
        return new StorageAction(Consts.searchItems, StorageType.Update, items, (result) => ({
            type: DictActionType.UpdateSearchItems,
            payload: result
        }))
    }

    static LoadLanguages(): StorageAction<DictActionType> {
        return new StorageAction(Consts.languages, StorageType.Get, [], (result) => {
            return ({
                type: DictActionType.LoadLanguages,
                payload: (result && result.length > 0) ? result : languages
            })
        })
    }

    static UpdateLanguages(items: Array<Language>): StorageAction<DictActionType> {
        return new StorageAction(Consts.languages, StorageType.Update, items, (result) => ({
            type: DictActionType.UpdateLanguages,
            payload: result
        }))
    }




}

export const DictReducer: Reducer<DictStates, StatesAction<DictActionType>> = (state = new DictStates(), action) => {
    switch (action.type) {
        case DictActionType.ToggleSetting:
            return { ...state, isSettingOpened: !state.isSettingOpened }
        case DictActionType.LoadSearchItems:
            return { ...state, searchItems: action.payload }
        case DictActionType.UpdateSearchItems:
            return { ...state, searchItems: action.payload }
        case DictActionType.LoadLanguages:
            return { ...state, languages: action.payload }
        case DictActionType.UpdateLanguages:
            return { ...state, languages: action.payload }
    }
    return state;
};
