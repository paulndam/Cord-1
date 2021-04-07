import { api } from "../apiClient";

export const getUserGuilds = () => api.get("/guilds");

export const createGuild = (body) => api.post("/guilds/create", body);

export const joinGuild = (body) => api.post("/guilds/join", body);

export const getInviteLink = (id, isPermanent = false) =>
  api.get(`/guilds/${id}/invite${isPermanent ? "?isPermanent=true" : ""}`);

export const invalidateInviteLinks = (id) => api.delete(`/guilds/${id}/invite`);

export const getGuildMembers = (id) => api.get(`/guilds/${id}/members`);

export const editGuild = (id, body) =>
  api.put(`/guilds/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteGuild = (id) => api.delete(`/guilds/${id}/delete`);

export const getGuildMemberSettings = (id) => api.get(`/guilds/${id}/member`);

export const changeGuildMemberSettings = (id, body) =>
  api.put(`/guilds/${id}/member`, body);

export const kickMember = (guildId, memberId) =>
  api.post(`/guilds/${guildId}/kick`, { memberId });

export const banMember = (guildId, memberId) =>
  api.post(`/guilds/${guildId}/bans`, { memberId });

export const leaveGuild = (id) => api.delete(`guilds/${id}`);

export const getBanList = (id) => api.get(`guilds/${id}/bans`);

export const unbanMember = (guildId, memberId) =>
  api.delete(`guilds/${guildId}/bans`, { data: { memberId } });
