import {useQuery} from "../hooks/useQuery.ts";
import clsx from 'clsx';

interface ResponseAreaProps {
}

const ResponseArea = ({}: ResponseAreaProps) => {
    const {currentResponse, queryState} = useQuery();
    const classNames = clsx('flex-grow min-h-[100px] p-5', {
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
                                <div className="overflow-y-scroll">{currentResponse}</div>
                            )
                        }

                    </div>
                </>)
            }
        </>
    );
}

export default ResponseArea;