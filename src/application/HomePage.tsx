import * as React from 'react';
import Basic from 'application/Basic/Basic';
import Config from 'application/Config/Config';
import Search from 'application/Search/Search';
import { DictProvider } from './DictContext';

const HomePage: React.FC = () => {
    return (
        <DictProvider>
            <Basic
                searching={<Search />}
                setting={<Config />}
            />
        </DictProvider>
    );
};

export default HomePage;
