import * as React from 'react';
import Basic from 'components/Basic/Basic';
import SearchWord from 'components/SearchWord/SearchWord';
import Settings from 'components/Setting/Settings';

export interface IHomePageProps {
}

export default class HomePage extends React.Component<IHomePageProps> {
    public render() {
        return (
            <Basic
                searching={<SearchWord></SearchWord>}
                setting={<Settings></Settings>} />
        );
    }
}
