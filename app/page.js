'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, setDoc, query, getDocs } from "firebase/firestore";
// import { Modak } from "next/font/google";
// import styles from "./page.module.css";

export default function Home() {
  // helper functions 
  // state variable to store inventory 
  const [inventory, setInventory] = useState([])
  // state variable to store the removal of stuff
  const [open, setOpen] = useState(true)
  // item names 
  // will be the defualt
  const [itemName, setItemName] = useState('')

  // filter 
  const [filteredInventory, setFilteredInventory] = useState([])

  // state for storing search query 
  const [searchQuery, setSearchQuery] = useState('');


  // fetch inventory from firebase

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList);
  }


  // helper function that removes item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }


  // helper function that adds item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })

    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }



  // calls function in there
  useEffect(() => {
    updateInventory()
  }, [])


  // update search

  useEffect(() => {
    setFilteredInventory(
      inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      )
    );
  }, [searchQuery, inventory]);


  // models  helper function 
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    // justify content centers horizontally 
    // align items centers vertically
    <Box width="100vw" height="100vh" display="flex"
      flexDirection="column"
      justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h1" color="white">
        Welcome To My Pantry
      </Typography>
      <Typography variant="h4" color="white">
        You can choose to add, filter, and search for items
      </Typography>

      <Button

        variant="contained"
        onClick={() => {
          handleOpen()
        }}
        sx={{
          padding: "12px 24px",
          borderRadius: '8px',
          backgroundColor: '#FF4191',
          '&:hover': {
            backgroundColor: '#E90074',
          },
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
        }}
      > Add New Item
      </Button>
      {/* search input field */}
      <TextField
        label="search items" // label for the search field
        variant="outlined" // outlined style for the text field
        value={searchQuery} // controls the value of the input field
        onChange={(e) => setSearchQuery(e.target.value)} // updates the searchQuery 

        sx={
          { mb: 2, width: '300px', bgcolor: "white", 
            borderRadius: "8px",
            border: " 2px solid #E90074"
          }
        }
      >

      </TextField>


      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"

          width={400}
          bgcolor="white"
          border="2px solid #FF4191 "
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >

          <Typography variant="h6" color="#FF4191"> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              placeholder="Item Name"
            />

            {/* Button to add the item */}
            <Button
              // variant = "outlined" 
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                color: "#ffffff", 
                padding: "12px 24px",
                borderRadius: '8px',
                backgroundColor: '#FF4191',
                '&:hover': {
                  backgroundColor: '#E90074',
                },
                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
              }}
              
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      {/* Button to open the modal for adding new items */}


      <Box
        border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#E90074"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="white" >
            Inventory items
          </Typography>
        </Box>

        {/* List of inventory items */}

        <Stack
          width="800px"
          height="300px"
          spacing={2}
          sx={
            { overflow: "auto" }
          }

        >
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box key={name} width="100%"
                minHeight="150px"
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3" color="black" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="black" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>


                  <Button
                    varriant="contained"
                    onClick={() => {
                      removeItem(name)
                    }}
                    sx={{
                      color: "#ffffff", 
                      padding: "12px 24px",
                      borderRadius: '8px',
                      backgroundColor: '#FF4191',
                      '&:hover': {
                        backgroundColor: '#E90074',
                      },
                      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Remove
                  </Button>

                  <Button
                    varriant="contained"
                    onClick={() => {
                      addItem(name)
                    }}
                    
                    sx={{
                      color: "#ffffff", 
                      padding: "12px 24px",
                      borderRadius: '8px',
                      backgroundColor: '#FF4191',
                      '&:hover': {
                        backgroundColor: '#E90074',
                      },
                      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Add
                  </Button>

                </Stack>
              </Box>


            ))}

        </Stack>
      </Box>
    </Box>


  );
}
