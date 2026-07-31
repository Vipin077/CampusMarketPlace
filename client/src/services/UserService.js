import api from "../utils/axiosConfig";

const UserService = {

  // =========================================================
  // GET USER BY ID
  // =========================================================

  async getUser(id) {
    const res = await api.get(
      `/users/${id}`
    );

    return res.data;
  },

  // =========================================================
  // GET USER BY EMAIL
  // =========================================================

  async getUserByEmail(email) {
    const res = await api.get(
      `/users/email/${email}`
    );

    return res.data;
  },

  // =========================================================
  // UPDATE CURRENT USER PROFILE
  // =========================================================

  async updateProfile(
    profileData,
    profilePicture = null
  ) {

    const formData = new FormData();

    // Backend expects @RequestPart("data")
    const dataBlob = new Blob(
      [
        JSON.stringify({
          fullName: profileData.fullName,
          bio: profileData.bio,
          department: profileData.department,
          year: profileData.year,
        }),
      ],
      {
        type: "application/json",
      }
    );

    formData.append(
      "data",
      dataBlob
    );

    // Profile picture is optional
    if (profilePicture) {
      formData.append(
        "profilePicture",
        profilePicture
      );
    }

    const res = await api.put(
      "/users/profile",
      formData
    );

    return res.data;
  },

};

export default UserService;