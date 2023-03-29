import {Dialog, Menu} from '@headlessui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faFile, faInfoCircle, faSave} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {DocumentIcon} from "@heroicons/react/20/solid";

function AboutUs({isOpen, setIsOpen}) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} as={"div"}
                className={"fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-50 z-50 opacity-90"}>
            <Dialog.Panel className={"shadow-lg px-4 py-2 bg-sky-300 w-3/5"}>
                <Dialog.Title className={"text-center text-2xl font-bold"}><FontAwesomeIcon icon={faInfoCircle}/> 關於
                    Web小畫家</Dialog.Title>
                <Dialog.Description className={"mt-6"}>
                    Made with ❤️ by <a href={"https://github.com/hsuan1117/"} target={"_blank"}
                                       className={"underline"}>hsuan1117</a>
                </Dialog.Description>

                <p>
                    軟體實驗作業一
                </p>

                <button onClick={() => setIsOpen(false)}
                        className={"inline-flex flex-row justify-center items-center w-full bg-green-500 py-2 mt-6 mb-2 shadow-lg"}>
                    <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} inverse/>
                    了解
                </button>
            </Dialog.Panel>
        </Dialog>
    )
}

export default function MenuBar({saveFile, aboutUs, clear}) {
    const [isOpen, setIsOpen] = useState(false)
    const newFile = () => {
        saveFile()
        clear()
    }
    return (
        <>
            <Menu className={"relative inline-block z-20"} as={"div"}>
                <div>
                    <Menu.Button
                        className="inline-flex justify-center items-center rounded-md mx-2 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 border">
                        <DocumentIcon className={"h-6 w-6"}/> 檔案
                    </Menu.Button>
                </div>
                <Menu.Items className={"absolute left-2 py-3 w-48 z-10 bg-gray-200 shadow-xl rounded-md flex flex-col"}>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={newFile}
                            >
                                <FontAwesomeIcon icon={faFile} className={"h-6 w-6"}/> 新建檔案
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={saveFile}
                            >
                                <FontAwesomeIcon icon={faSave} className={"h-6 w-6"}/> 儲存檔案
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={() => setIsOpen(true)}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} className={"h-6 w-6"}/> 關於 Web小畫家
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
            <AboutUs isOpen={isOpen} setIsOpen={setIsOpen}/>
        </>
    )
}
