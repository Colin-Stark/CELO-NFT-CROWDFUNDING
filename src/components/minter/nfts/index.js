import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";


import {
  getNfts,
  createNft,
  fetchNftContractOwner,

  
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

//import { ethers } from "ethers";

const NftList = ({minterContract, name}) => {

 

  /* performActions : used to run smart contract interactions in order
  *  address : fetch the address of the connected wallet
  */
  const {performActions, address} = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ setNftOwner] = useState(null);

  
  
 

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts(minterContract);
      if (!allNfts) return
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createNft(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };
  /////////////////////////////
 


  
  
  /////////////////////////////////////
  

  const fetchContractOwner = useCallback(async (minterContract) => {

    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, [setNftOwner]);

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
        

      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner ]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>

              {/* give the add NFT permission to user who deployed the NFT smart contract */}
             
            
             {/** {nftOwner === address ? (
                  <AddNfts save={addNft} address={address}/>
              ) : null} */}

<AddNfts save={addNft} address={address}/>
  
             

            </div>

           
            {nfts.length > 0 ? (
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">

              {/* display all NFTs */}
              {nfts.map((_nft) => (
                  <Nft
                      key={_nft.index}
                      nft={{
                        ..._nft,
                      }}
                  />
              ))}
            </Row>
             ) : (
              <p className="text-center my-5 fs-2">No uploaded NFT card available</p>
            )}
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {

  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;