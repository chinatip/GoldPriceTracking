import axios from "./Axios";

export async function fetchGoldPrices(numOfRec) {
    const response = await axios.get("/prices?number=" + numOfRec);

    if (response.status !== httpStatus.ok) {
        console.log("Fetch gold price failed");
        return [];
    }

    return response.data;
}

export function formatNumber(number, lang = "th-TH") {
    return number.toLocaleString(lang);
}

export const httpStatus = {
    ok: 200,
    internalServerError: 500,
    badRequest: 400,
};
