// @flow

//                                                       <((((((\\\
//                                                       /      . }\
//                                                       ;--..--._|}
//                                    (\                 '--/\--'  )
//                                     \\                | '-'  :'|
//                                      \\               . -==- .-|
//                                       \\               \.__.'   \--._
//                                       [\\          __.--|       //  _/'--.
//                                       \ \\       .'-._ ('-----'/ __/      \
//                                        \ \\     /   __>|      | '--.       |
//                                         \ \\   |   \   |     /    /       /
//                                          \ '\ /     \  |     |  _/       /
//                                           \  \       \ |     | /        /
//                                            \  \      \        /

let INTERNAL_PROCESS_PID: ?number = null;
let terminated = false;

function kill(processType, pid) {
  console.log(`-> Killing ${processType} process ${pid}`); // eslint-disable-line no-console
  process.kill(pid, "SIGTERM");
}

exports.setInternalProcessPID = (pid: number) => (INTERNAL_PROCESS_PID = pid);

exports.terminate = () => {
  terminated = true;
  if (INTERNAL_PROCESS_PID) kill("internal", INTERNAL_PROCESS_PID);
};

exports.isTerminated = () => terminated;
