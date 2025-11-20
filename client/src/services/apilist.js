

const server = process.env.REACT_APP_BACKEND_URL ||"http://localhost:8080";

export const apilist = {
    post_links:`${server}/api/links`,
    get_links:`${server}/api/links`,
    link_details:(code)=>`${server}/api/links/${code}`,
    delete_link:(code)=>`${server}/api/links/${code}`,
    redirect_link:(code)=>`${server}/${code}`,
    healthz_link:`${server}/healthz`
}
console.log("Backend server url:",server);