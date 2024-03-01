import { Input, Button, Divider } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import 'react-native-get-random-values';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SQLite from 'react-native-sqlite-storage';
import { nanoid } from 'nanoid';

const Todo = () =>{
    const db = SQLite.openDatabase({name:'taskify',location:'default'},()=>{
        console.log('opened Database');
    },err=>{
        console.log(err);
    });
    const [todo,setTodo] = useState('');
    const [todos,setTodos] = useState([]);
    useEffect(()=>{
        CreateTable();
    });
    useEffect(()=>{
        GetTodos();
    },[]);
    const CreateTable = async () =>{
        await db.transaction(async tx=>{
            await tx.executeSql(`CREATE TABLE IF NOT EXISTS TODOS(todo TEXT NOT NULL,finished TEXT NOT NULL,id TEXT NOT NULL);`);
        });
    };
    const HandleTodo = async () =>{
        if(todo!=''){
            const id = nanoid();
            setTodos([...todos,{todo:todo,finished:false,id}]);
            setTodo('');
            await db.transaction(async tx=>{
                await tx.executeSql(`INSERT INTO TODOS VALUES(?,?,?)`,[todo,'false',id]);
            });
        }
    };
    const GetTodos = () =>{
        db.transaction(async tx=>{
            await tx.executeSql('SELECT * from TODOS',[],(tx,results)=>{
                console.log(results.rows.length);
                const todos = results.rows.raw();
                const parsedTodos = todos.map(todo=>{
                    return{
                        todo:todo.todo,
                        id:todo.id,
                        finished:JSON.parse(todo.finished)
                    };
                });
                setTodos(parsedTodos);
            });
        })
    };
    return(
        <View style={styles.wrapper}>
            <Text style={styles.label}>Todos</Text>
            <Text style={{marginLeft:10,marginTop:6}}>Manage Your Todo's</Text>
            <Input placeholder="Enter Todo" style={styles.Input} onChangeText={text=>setTodo(text)} value={todo}/>
            <Button style={styles.button} status='primary' onPress={HandleTodo}>Add Todo</Button>
            <Text style={styles.label2}>List of Todos</Text>
            <FlatList data={todos} renderItem={(todo)=>{
                return(
                    <>
                        <View key={todo.item.id} style={styles.todoCon}>
                            <Text style={{color:"black",padding:10,width:"80%",textDecorationLine:todo.item.finished ? 'line-through' : 'none'}} numberOfLines={1}>{todo.item.todo}</Text>
                            <View style={{
                                display:'flex',
                                flexDirection:'row',
                                justifyContent:'center',
                                alignItems:'center',
                            }}>
                                {!todo.item.finished && <MaterialIcons name="file-download-done" size={24} color="green" style={{marginRight:10}} onPress={()=>{
                                    const new_todos = todos.map(td=>{
                                        if(td.id===todo.item.id){
                                            return {...td,finished:true};
                                        }
                                        return td;
                                    });
                                    setTodos(new_todos);
                                    db.transaction(async tx=>{
                                        await tx.executeSql(`UPDATE TODOS SET finished = 'true' where id = '${todo.item.id}'`)
                                    })
                                }}/>}
                                <MaterialIcons name="delete" size={24} color="red" onPress={()=>{
                                    const new_todos = todos.filter(td=>td.id!==todo.item.id);
                                    setTodos(new_todos);
                                    db.transaction(async tx=>{
                                        await tx.executeSql(`DELETE FROM TODOS WHERE id = '${todo.item.id}'`)
                                    })
                                }}/>
                            </View>
                        </View>
                        <Divider/>
                    </>
                );
            }}/>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:'white'
    },
    label:{
        fontSize:24,
        color:"black",
        marginTop:10,
        marginLeft:10
    },
    Input:{
        marginTop:10,
        width:"90%",
        marginLeft:"auto",
        marginRight:"auto",
    },
    button:{
        width:'90%',
        marginTop:10,
        marginLeft:'auto',
        marginRight:'auto'
    },
    label2:{
        marginTop:10,
        textAlign:'center',
    },
    todoCon:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    }
});

export default Todo;