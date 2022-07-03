package main

import (
    "fmt"
    "log"
	"os"
	"reflect"
    "example.com/greetings"
	"strconv"
)
type Student struct {
    Name string
    Age int64
    Wight int64
    Height int64
    Score int64

}
func (self *Student)Initialize() *Student {
	self.Name = "Stu-X"
	self.Age = 19
	self.Wight = 60
	self.Height = 170
	self.Score = 310
	return self
}
func (self *Student)String() string {
	// strconv.Itoa(10)
	var str string = "Student("
	str += self.Name + ", "
	str += strconv.FormatInt(self.Age, 10) + ", "
	str += strconv.FormatInt(self.Wight, 10) + ", "
	str += strconv.FormatInt(self.Height, 10) + ", "
	str += strconv.FormatInt(self.Score, 10) + ")"
	return str
}
func main() {

	var stu1 = new(Student)

	fmt.Println("01 stu1: ", stu1)
	stu1.Initialize();
	fmt.Println("02 stu1: ", stu1)

    fmt.Printf("memory addr: %p\n",&stu1.Name)
    fmt.Printf("memory addr: %p\n",&stu1.Age)
    fmt.Printf("memory addr: %p\n",&stu1.Wight)
    fmt.Printf("memory addr: %p\n",&stu1.Height)
    fmt.Printf("memory addr: %p\n",&stu1.Score)
    typ := reflect.TypeOf(Student{})
    fmt.Printf("Struct is %d bytes long\n", typ.Size())
    // We can run through the fields in the structure in order
    n := typ.NumField()

    for i := 0; i < n; i++ {
        field := typ.Field(i)
        fmt.Printf("%s at offset %v, size=%d, align=%d\n",
            field.Name, field.Offset, field.Type.Size(),
            field.Type.Align())
    }

	var name string = "";
	argsLen := len(os.Args)
	if argsLen > 1 {
		name = "" + os.Args[1];
	}
    // Set properties of the predefined Logger, including
    // the log entry prefix and a flag to disable printing
    // the time, source file, and line number.
    log.SetPrefix("greetings: ")
	log.SetFlags(log.Llongfile | log.Lmicroseconds | log.Ldate)
    // log.SetFlags(0)
	if name =="" {
		name = "none"
	}
	// A slice of names.
    names := []string{"Gladys", "Samantha", "Darrin", name}

    // Request greeting messages for the names.
    messages, err := greetings.Hellos(names)
    if err != nil {
        log.Fatal(err)
    }
    // If no error was returned, print the returned map of
    // messages to the console.
    fmt.Println(messages)
	/*
    // Request a greeting message.
    message, err := greetings.Hello(name)
    // If an error was returned, print it to the console and
    // exit the program.
    if err != nil {
        log.Fatal(err)
    }

    // If no error was returned, print the returned message
    // to the console.
    fmt.Println(message)
	//*/
}