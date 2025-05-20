function delayfun(time){
    return new Promise((resolve) => setTimeout(resolve,time))
}


async function delay_fun(name) {
    await delayfun(4000);
    console.log(name)
}

delay_fun('Gautam')