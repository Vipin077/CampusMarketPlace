import api from "../utils/axiosConfig";

const DashboardService = {

    async getDashboard() {

        const response = await api.get("/dashboard");

        return response.data;
    }

};

export default DashboardService;