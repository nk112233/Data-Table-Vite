import React, { useRef, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";
import { Paginator ,  PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface Product {
  name: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface PaginationData {
  total: number;
  limit: number;
  total_pages: number;
  current_page: number;
  next_url: string;
}


const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [first, setFirst] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number>(0); 
  const [rows, _setRows] = useState<number>(12); 
  const [quotient , setQuotient] = useState<number>(-1)
  const [_remainder , setRemainder] = useState<number>(0)
  const [visitedpage , setVisitedPage] = useState<number[]>([])
  const op = useRef<OverlayPanel>(null);
  let [rowsperpage , setRowsPerPage] = useState<number[]>([])
  const getProducts = async () => {
    try {
      const res = await axios.get('https://api.artic.edu/api/v1/artworks?page=1');
      
      setProducts(res.data.data);
      setPaginationData(res.data.pagination);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);


  useEffect(() => {

    if(quotient != -1){
      handlePersist(paginationData?.current_page || 1);
    }
      
  }, [paginationData?.current_page]); 


  useEffect(() => {
    if(quotient != -1){
      handleRowsPerPage();
  }

  }, [ selectedRows]); 



  const onPageChange = async (event: PaginatorPageChangeEvent) => {
    try {


      const page = (event.first / event.rows) + 1;

      const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      
      setProducts(res.data.data);
      setPaginationData(res.data.pagination);
      setFirst(event.first);
      
    } catch (error) {
      console.error(error);
    }
  };



  const handlePersist = (page : number) => {

    if(!visitedpage[page-1] && rowsperpage[page-1]){
      let arrayofSelectedRows: Product[] = products.slice(0, rowsperpage[page-1]);
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        ...arrayofSelectedRows,
    ]);
    setVisitedPage((prev) => {
      const updated = [...prev];
      updated[page - 1] = 1; 
      return updated; 
    });
    }
  }



  const handleRowsPerPage = () => {
    let q = 0
    let r =  0
    if(quotient == 0 ){
      setQuotient(Math.floor(selectedRows/12));
      q = Math.floor(selectedRows/12);
      setRemainder(selectedRows%12);
      r = selectedRows%12
    
    let temp:number[] = [];
    while(q--){
      temp.push(12);
    }
    temp.push(r);
    
    setRowsPerPage(temp)

    
    let currpage:number = (paginationData?.current_page || 1) - 1 
    let arrayofSelectedRows: Product[] = products.slice(0, rowsperpage[currpage]);
    setSelectedProducts(arrayofSelectedRows)  
    let totalLength = q + r;
    let temp1: number[] = Array.from({ length: totalLength }, () => 0);
    temp1[0] = 1;
    setVisitedPage(temp1);
    op.current?.hide();
    }
  }



  return (
<div
  style={{
    display: "flex",
    position: "relative",
    padding: "2.5rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }}
>



      <DataTable
        value={products}
        selectionMode="multiple"
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
      >
        
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}>

        </Column>

        <Column
          field="name"
          header={
            <div style={{"display":"flex","alignItems":"center"}}>
              <Button
                type="button"
                icon="pi pi-chevron-down"
                onClick={(e) => {
                  op.current?.toggle(e);
                  setSelectedProducts([]);
                  setQuotient(0);
                  setRemainder(0);
                  setVisitedPage([]);
                }}
                style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: 'white'}}
              />
              <span>Code</span>
            </div>
          }
        ></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
        
      </DataTable>
      


      <OverlayPanel ref={op}>
      <div style={{ padding: '2px', maxWidth: '80px', maxHeight: '100px'  }}>
  <div className="p-fluid" style={{ gap: '0px' }}>
    <div className="p-field" style={{ marginBottom: '2px' }}>
      <label htmlFor="rows" style={{ fontSize: '0.6rem' }}>Rows</label>
      <InputNumber
        id="rows"
        value={selectedRows}
        onValueChange={(e) => setSelectedRows(e.value || 0)}
        min={0}
        max={100}
        defaultValue={0}
        style={{ width: '100%', fontSize: '0.8rem', padding: '3px' }}
      />
    </div>
    <Button
      label="Set"
      onClick={handleRowsPerPage}
      style={{ fontSize: '0.7rem', padding: '3px', height: '1.5rem' }}
    />
  </div>
</div>

      </OverlayPanel>

      <div>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={paginationData?.total || 0}
          onPageChange={onPageChange}
          rightContent={`Total: ${paginationData?.total || 0}`}
        />
      </div>
    </div>
  );
};

export default ProductTable;
