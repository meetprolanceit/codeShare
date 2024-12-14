const shareCodeNow = document?.getElementById('shareCodeNow');
const room_API = 'http://localhost:3000/rooms';
const messages_API = 'http://localhost:3000/messages';

function generateHexKey() {
    return Math.random().toString(16).substring(2, 14);
}

const addData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log(`🚀 ~ addData ~ response:`, response);
        return response.json();
    } catch (error) {
        console.log(`🚀 ~ addData ~ error:`, error);
    }
};

const getData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(`🚀 ~ getData ~ error:`, error);
    }
};

const updateData = async (url, id, data) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (error) {
        console.log(`🚀 ~ updateData ~ error:`, error);
    }
};

const deleteData = async (url, id) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    } catch (error) {
        console.log(`🚀 ~ deleteData ~ error:`, error);
    }
};

shareCodeNow?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const roomId = generateHexKey();
    const roomObj = {
        roomId,
    };
    const b = await addData(room_API, roomObj);
    window.location.href = `http://127.0.0.1:5500/public/codeShare.html?id=${roomId}`;
});

const codeShareInput = document.getElementById('codeInput');

codeShareInput?.addEventListener('change', async (e) => {
    e.preventDefault();
    const value = e.target.value;
    const roomId = new URLSearchParams(window.location.search).get('id');
    const messages_data = await getData(`${messages_API}?roomId=${roomId}`);
    const existRoomMessage = messages_data.filter((item) => item.roomId === roomId);

    if (value) {
        if (existRoomMessage.length !== 0) {
            existRoomMessage[0].value = value;
            const data = await updateData(messages_API, existRoomMessage[0].id, existRoomMessage[0]);
        } else {
            const messages = {
                value,
                roomId,
            };
            await addData(messages_API, messages);
        }
    } else {
        await deleteData(messages_API, existRoomMessage[0].id);
    }
});

const getAndAddData = async (event) => {
    event.preventDefault();
    const roomId = new URLSearchParams(window.location.search).get('id');
    const messages_data = await getData(`${messages_API}?roomId=${roomId}`);
    const existRoomMessage = messages_data.filter((item) => item.roomId === roomId);

    if (existRoomMessage.length !== 0) {
        codeShareInput.value = existRoomMessage[0].value;
    }

    const roomData = await getData(`${room_API}?roomId=${roomId}`);
    const existRoom = roomData.filter((item) => item.roomId === roomId);

    if (existRoom.length === 0) {
        console.log(`🚀 ~ getAndAddData ~ existRoom:`, existRoom);
        const roomObj = {
            roomId,
        };
        await addData(room_API, roomObj);
    }
};
