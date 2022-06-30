package main
import (
    "fmt"
    "net/http"
    "strings"
    "log"
	"strconv"
)
// thanks: https://www.cnblogs.com/franklee97/p/7131551.html
var global = 1
func sayhelloName(w http.ResponseWriter, r *http.Request) {
    r.ParseForm() //解析参数，默认是不会解析的
    fmt.Println(r.Form) //这些信息是输出到服务器端的打印信息
    fmt.Println("path", r.URL.Path)
    fmt.Println("scheme", r.URL.Scheme)
    fmt.Println(r.Form["url_long"])
    for k, v := range r.Form {
        fmt.Println("key:", k)
        fmt.Println("val:", strings.Join(v, ""))
    }
    fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path) //这个写入到w的是输出到客户端的
    fmt.Fprintf(w, "Hello Wrold!" + strconv.Itoa(global)) //这个写入到w的是输出到客户端的
	global += 1;
}
func main() {
    http.HandleFunc("/", sayhelloName) //设置访问的路由
    err := http.ListenAndServe(":9090", nil) //设置监听的端口
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}