<script>
  import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
  import { db } from "./firebase";

  export let todoText;
  export let todoID;
  export let isCompleted;

  async function delTodo() {
    await deleteDoc(doc(db, "todos", todoID));
    console.log("deleted");
  }
  async function updateTodo() {
    isCompleted = !isCompleted;
    const todoRef = await doc(db, "todos", todoID);
    await updateDoc(todoRef, {
      isCompleted,
    });
  }
</script>

<li>
  <span class={`${isCompleted ? "is_complete" : "not_completed"}`}>
    {todoText}
  </span>
  <button on:click={updateTodo}>{isCompleted ? "❌" : "✅"}</button>
  <button on:click={delTodo}> 🗑️ </button>
</li>

<style>
  .is_complete {
    text-decoration: line-through;
  }
  li {
    margin-top: 1.2rem;
  }
</style>
