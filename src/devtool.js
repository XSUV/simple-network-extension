
try {
  chrome.devtools.panels.create('spNet', '', '../index.html', function () {
    console.log('spNet devtools panel create')
  })
} catch (error) {
  console.log("🚀 ~ spNet error:", error)
}