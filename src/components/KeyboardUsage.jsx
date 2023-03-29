import {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline'

export default function KeyboardUsage({open, setOpen}) {

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
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
                                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <InformationCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            Keyboard shortcut guide
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                建立了一些快捷鍵，方便使用者操作，以下是快捷鍵的使用方式：
                                            </p>
                                            <div className={"mt-2"}>
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                            快捷鍵
                                                        </th>
                                                        <th scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            功能
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>⌘Z</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">復原</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>⌘Y</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">取消復原</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>⌘S</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">下載檔案</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>⌘E</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">置入圖片</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>ESC</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">切換為畫筆</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <KBD>T</KBD>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">切換為文字輸入</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

function KBD({children}) {
    return (
        <div
            className={"border border-gray-400 bg-gray-200 w-fit px-2 py-1 rounded-md"}>{children}
        </div>
    )
}
