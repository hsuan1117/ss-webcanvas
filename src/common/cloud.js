import Swal from "sweetalert2";

export async function importFile(token, password, loadImage, ui = true) {
    try {
        const path = await (await (await fetch('https://canvas-api.hsuan.app/api/query', {
            method: 'POST',
            body: JSON.stringify({
                token,
                password
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })).json())

        if (path?.path === undefined) {
            throw new Error(path?.message)
        }

        loadImage('https://canvas-api.hsuan.app/storage/' + path.path)
    } catch (e) {
        if (ui)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '載入失敗，請確認代碼或密碼是否正確 (' + e.message + ')',
            })
    }
}