import s from "node-schedule";
import io from "@pm2/io";
interface Session
{
    id: string;
    user?: {
        username: string;
        authenticated: boolean;
    }
    date: Date;
}


const realtimeUsers = io.metric({
    name: "Realtime Users",
    id: "realtimeUsers"
})

export const Sessions:Session[] =
[

];

export const checkUser = (username:string, Session:string) => Sessions.filter(session => session.id === Session && session.user?.username === username && session.user?.authenticated === true).length > 0;

const checkSessions = ():void =>
{
    Sessions.forEach(session =>
    {
        if (session.date.getTime() + (1000 * 60 * 1) < new Date().getTime())
        {
            console.log(`Session ${session.id} expired`);
            
            Sessions.splice(Sessions.indexOf(session), 1);
        }
    });
    realtimeUsers.set(Sessions.length);


}

export const RefreshSession = (Session:string):void =>
{
    Sessions.filter(session => session.id === Session).forEach(session => session.date = new Date());
}


export const checkAlreadyLoggedIn = (username:string):boolean =>
{
    Sessions.forEach(session =>
    {
        if (session.user?.username == username) return true;
    });

    return false;
}

s.scheduleJob("*/10 * * * *", checkSessions);