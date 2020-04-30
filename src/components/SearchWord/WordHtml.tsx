import * as React from 'react';

export interface IWordHtmlProps {
    html: string;
}

export default class WordHtml extends React.Component<IWordHtmlProps, { html: string }> {

    constructor(props: Readonly<IWordHtmlProps>) {
        super(props);
        this.state = { html: '' }
    }
    componentDidMount() {
        this.setState({
            html: this.props.html
        })
    }
    public render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.html }} style={{ pointerEvents: 'none' }} />
        );
    }
}
