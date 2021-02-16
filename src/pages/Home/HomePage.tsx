import * as React from 'react';
import Basic from 'components/Basic/Basic';
import SearchWord from 'components/SearchWord/SearchWord';
import Config from 'components/Config/Config';

export interface IHomePageProps {
}

export default class HomePage extends React.Component<IHomePageProps> {
    public render() {
        return (
            <Basic
                searching={<SearchWord />}
                setting={<Config />}
            />
        );
    }
}
