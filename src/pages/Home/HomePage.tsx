import * as React from 'react';
import Basic from 'components/Basic/Basic';
import Config from 'components/Config/Config';
import Search from 'components/Search/Search';

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
