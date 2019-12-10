console.log('this is core')

async function test() {
  const p = new Promise(resolve => {
    setTimeout(() => {
      resolve('yolo')
    }, 2000)
  })

  const result = await p
  console.log(result)
}

test()
