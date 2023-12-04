import {useQuery} from "../../../hooks/useQuery.ts";
import clsx from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ResponseAreaProps {
}

const ResponseArea = ({}: ResponseAreaProps) => {
    const {currentResponse, queryState} = useQuery();
    const classNames = clsx('flex-grow overflow-y-auto', {
        'flex items-center justify-center': queryState === 'asking' || queryState === 'error'
    });
    return (
        <>
            {queryState !== 'preQuery' && (
                <>
                    {(queryState === 'postQuery') && (
                        <hr className="border-gray-700 mx-5"/>
                    )}
                    <div className={classNames}>
                        {
                            queryState === 'asking' && (
                                <span className="loader"></span>

                            )
                        }
                        {
                            queryState === 'error' && (
                                <div className="text-3xl">Error</div>
                            )
                        }
                        {
                            queryState === 'postQuery' && currentResponse && (
                                <div className="p-4 bg-gray-200">
                                    <ResponseText response={currentResponse}/>
                                </div>
                            )
                        }

                    </div>
                </>)
            }
        </>
    );
}

interface ResponseTextProps {
    response: string;
}

const ResponseText = ({ response }: ResponseTextProps) => {
    return (
        <article className="prose prose-slate">
            <Markdown
                children={response}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
                remarkPlugins={[remarkGfm]}
            />
        </article>
    )
}

export default ResponseArea;