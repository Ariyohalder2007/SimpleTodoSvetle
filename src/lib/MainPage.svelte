<script>
  import { getAuth, signOut } from "firebase/auth";
  import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
  } from "firebase/firestore";
  import { user } from "../stores/svetleStore";
  import { auth, db } from "./firebase";
  import TodoItem from "./TodoItem.svelte";

  let addTodoText;
  let currentUser;
  user.subscribe((val) => (currentUser = val));
  let isLoadingComplete;
  async function logOut() {
    await signOut(auth);
  }

  let currentTodoList = [];

  async function loadTodoList() {
    isLoadingComplete = false;
    try {
      console.log("Loading Todo List");
      const todoListQuery = query(
        collection(db, "todos"),
        where("userID", "==", currentUser.uid)
      );
      // TODO: Doo the rest from here
      onSnapshot(todoListQuery, async function (snapshot) {
        snapshot.docChanges().forEach((change) => {
          const tempTodo = {
            todoText: change.doc.data().todoText,
            id: change.doc.id,
            timestamp: change.doc.data().timestamp,
            userID: change.doc.data().userID,
            isCompleted: change.doc.data().isCompleted,
          };
          if (change.type == "added") {
            currentTodoList = [...currentTodoList, tempTodo];
          }
          if (change.type == "removed") {
            currentTodoList = currentTodoList.filter(
              (e) => e.id != tempTodo.id
            );
            console.log("Removed");
          }
        });
        isLoadingComplete = true;
      });
    } catch (error) {
      console.log(error);
    }
  }
  loadTodoList();

  async function addTodo() {
    if (addTodoText) {
      try {
        await addDoc(collection(db, "todos"), {
          todoText: addTodoText,
          userID: currentUser.uid,
          isCompleted: false,
          timestamp: serverTimestamp(),
        });
        addTodoText = "";
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Enter TODO text!");
    }
  }
</script>

<h1>Hello! {currentUser.displayName}</h1>

{#if isLoadingComplete}
  {#if currentTodoList[0]}
    <h1>Todos!</h1>
    <ul>
      {#each currentTodoList as todoItem}
        <TodoItem
          isCompleted={todoItem.isCompleted}
          todoID={todoItem.id}
          todoText={todoItem.todoText}
        />
      {/each}
    </ul>
  {:else}
    <h2>Try Adding Todo's!</h2>
  {/if}
{:else}
  <div class="loader">Loading...</div>
{/if}

<div>
  <input bind:value={addTodoText} type="text" placeholder="todo work" />
  <button on:click={addTodo}>🕊️</button>
</div>

<button on:click={logOut}>Sign Out</button>
