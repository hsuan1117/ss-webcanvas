import {Dialog, Menu} from '@headlessui/react'
import {Fragment, useEffect} from "react";
import {Transition} from "@headlessui/react";
import {useState} from "react";
import {
    ClockIcon,
    CloudArrowDownIcon,
    CloudArrowUpIcon,
    CloudIcon,
    CodeBracketIcon, LockClosedIcon
} from "@heroicons/react/20/solid";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import {importFile} from "../common/cloud";

function ImportFile({isOpen, setIsOpen, loadImage}) {
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')
    const importImage = async () => {
        importFile(token, password, loadImage).then(() => {
            setIsOpen(false)
        })
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div
                                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <InformationCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            載入圖片
                                        </Dialog.Title>
                                        <div className="mt-2 w-full">
                                            <div className={""}>
                                                <div className="relative mt-2 rounded-md shadow-sm">
                                                    <div
                                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <CodeBracketIcon className="h-5 w-5 text-gray-400"
                                                                         aria-hidden="true"/>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="code"
                                                        id="code"
                                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="六位數代碼"
                                                        value={token}
                                                        onChange={(e) => setToken(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={""}>
                                                <div className="relative mt-2 rounded-md shadow-sm">
                                                    <div
                                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <LockClosedIcon className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"/>
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="密碼（如果有設定）"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={importImage}
                                    >
                                        載入
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

function UploadFile({uploadOpen, setUploadOpen, history, filename}) {
    const [password, setPassword] = useState('')

    const uploadFile = async () => {
        const file = await ((await fetch(history[history.length - 1])).blob())
        const form = new FormData()
        form.append('file', file)
        if (password !== '')
            form.append('password', password)
        const photo = await (await fetch('https://canvas-api.hsuan.app/api/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: form
        })).json()
        localStorage.setItem('shareHistory', JSON.stringify([
            ...JSON.parse(localStorage.getItem('shareHistory') || '[]'),
            {
                code: photo.token,
                time: new Date().toLocaleString(),
                filename
            }
        ]))
        const link = window.location.protocol + '//' + window.location.host + "?load=" + photo.token + (password !== '' ? "&password=" + password : '')
        Swal.fire({
                title: '上傳完成！',
                html: `分享六位數代碼： ${photo.token} <br/><a href="${link}"/>${link}</a>`,
                icon: 'success',
                confirmButtonText: '複製連結',
        }).then(res => {
            navigator.clipboard.writeText(link)
        })
        setUploadOpen(false)
    }

    return (
        <Transition.Root show={uploadOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setUploadOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div
                                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <InformationCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            上傳圖片
                                        </Dialog.Title>
                                        <div className="mt-2 w-full">
                                            <div className={""}>
                                                <div className="relative mt-2 rounded-md shadow-sm">
                                                    <div
                                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <LockClosedIcon className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"/>
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="密碼（可不設定）"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={uploadFile}
                                    >
                                        上傳
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

function HistoryList({historyOpen, setHistoryOpen}) {
    const [data, setData] = useState([])
    const [showRealDelete, setShowRealDelete] = useState(false)

    const realDeleteHistory = () => {
        localStorage.setItem('shareHistory', JSON.stringify([]))
        setData([])
        setHistoryOpen(false)
    }

    useEffect(() => {
        localStorage.getItem('shareHistory') && setData(JSON.parse(localStorage.getItem('shareHistory')))
    }, [historyOpen])

    return (
        <Transition.Root show={historyOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setHistoryOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div
                                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <InformationCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            分享紀錄
                                        </Dialog.Title>
                                        <div className="mt-2 w-full">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                <tr>
                                                    <th scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                        六位數代碼
                                                    </th>
                                                    <th scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                        檔案名稱
                                                    </th>
                                                    <th scope="col"
                                                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                                        分享時間
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                {data.map(({code, filename, time}) => (
                                                    <tr key={time}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                            {code}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                            {filename}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{time}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className={`${showRealDelete && 'hidden'} inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                        onClick={() => setShowRealDelete(true)}
                                    >
                                        清除紀錄
                                    </button>
                                    <button
                                        type="button"
                                        className={`${!showRealDelete && 'hidden'} inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600`}
                                        onClick={realDeleteHistory}
                                    >
                                        您真的確定要清除紀錄嗎？
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


export default function MenuBarCloud({history, loadImage, filename}) {
    const [isOpen, setIsOpen] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)

    return (
        <>
            <Menu className={"relative inline-block z-20"} as={"div"}>
                <div>
                    <Menu.Button
                        className="inline-flex justify-center items-center rounded-md mx-2 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 border">
                        <CloudIcon className={"h-6 w-6"}/> 雲端服務
                    </Menu.Button>
                </div>
                <Menu.Items className={"absolute left-2 py-3 w-48 z-10 bg-gray-200 shadow-xl rounded-md flex flex-col"}>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={() => setUploadOpen(true)}
                            >
                                <CloudArrowUpIcon className={"h-6 w-6"}/> 上傳圖片
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={() => setIsOpen(true)}
                            >
                                <CloudArrowDownIcon className={"h-6 w-6"}/> 載入圖片
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({active}) => (
                            <button
                                className={`inline-flex items-center gap-1 px-4 py-3 ${active && 'bg-gray-300'}`}
                                onClick={() => setHistoryOpen(true)}
                            >
                                <ClockIcon className={"h-6 w-6"}/> 分享紀錄
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
            <ImportFile isOpen={isOpen} setIsOpen={setIsOpen} loadImage={loadImage}/>
            <HistoryList historyOpen={historyOpen} setHistoryOpen={setHistoryOpen}/>
            <UploadFile uploadOpen={uploadOpen} setUploadOpen={setUploadOpen} history={history} filename={filename}/>
        </>
    )
}
