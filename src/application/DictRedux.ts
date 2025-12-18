import { Language, languages } from "application/Models/Language";
import { StorageType } from "core/Models/StorageType";
import { Reducer, UnknownAction } from "redux";
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
            const languageArray = result as Language[];
            return ({
                type: DictActionType.LoadLanguages,
                payload: (languageArray && languageArray.length > 0) ? languageArray : languages
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

export const DictReducer: Reducer<DictStates, UnknownAction> = (state = new DictStates(), action) => {
    const dictAction = action as StatesAction<DictActionType>;
    switch (dictAction.type) {
        case DictActionType.ToggleSetting:
            return { ...state, isSettingOpened: !state.isSettingOpened }
        case DictActionType.LoadSearchItems:
            return { ...state, searchItems: dictAction.payload as SearchItem[] }
        case DictActionType.UpdateSearchItems:
            return { ...state, searchItems: dictAction.payload as SearchItem[] }
        case DictActionType.LoadLanguages:
            return { ...state, languages: dictAction.payload as Language[] }
        case DictActionType.UpdateLanguages:
            return { ...state, languages: dictAction.payload as Language[] }
    }
    return state;
};
