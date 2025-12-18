import * as React from 'react';
import Basic from 'application/Basic/Basic';
import Config from 'application/Config/Config';
import Search from 'application/Search/Search';

const HomePage: React.FC = () => {
    return (
        <Basic
            searching={<Search />}
            setting={<Config />}
        />
    );
};

export default HomePage;
