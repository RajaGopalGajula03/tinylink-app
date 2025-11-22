

const server = "http://localhost:8080";


// const server = process.env.REACT_APP_BACKEND_URL;
export const apilist = {
    post_links:`${server}/api/links`,
    get_links:`${server}/api/links`,
    link_details:(code)=>`${server}/api/links/${code}`,
    delete_link:(code)=>`${server}/api/links/${code}`,
    redirect_link:(code)=>`${server}/${code}`,
    healthz_link:`${server}/healthz`
}
console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
