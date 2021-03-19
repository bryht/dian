import * as React from 'react';
import Basic from 'application/Basic/Basic';
import Config from 'application/Config/Config';
import Search from 'application/Search/Search';

export interface IHomePageProps {
}

export default class HomePage extends React.Component<IHomePageProps> {
    public render() {
        return (
            <Basic
                searching={<Search />}
                setting={<Config />}
            />
        );
    }
}
