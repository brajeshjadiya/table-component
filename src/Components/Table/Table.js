import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.scss"

const Table = () => {
    const [tableData, setTableData] = useState([])
    const [issort, setIsSort] = useState(false)
    const [shownext, setShowNext] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const sortDescending = (e) => {
        if (e.target.name === "nameSorting" && issort) {
            const SortByName = [...tableData].sort((a, b) => (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) ? 1 : -1)
            setTableData(SortByName)
            setIsSort(false)
        }
        else {
            const SortByName = [...tableData].sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) ? 1 : -1)
            setTableData(SortByName)
            setIsSort(true)
        }
    }

    const Pagination = () => {
        let Pages = Math.round(Math.ceil(tableData.length / 10))
        let Pagination = [], i = 1;

        while (i <= Pages) {
            if (i <= 2 ||
                (i >= (Pages - 2)) ||
                ((i >= (currentPage - 1) && i <= currentPage + 1))
            ) {
                Pagination.push(i)
                i++

            }
            else {
                Pagination.push("...")
                i = i < currentPage ? currentPage - 1 : Pages - 1
            }
        }
        return Pagination

    }

    const NextPage = () => {
        if (tableData.length >= shownext) {

            setShowNext(shownext + 10)
            setCurrentPage((shownext + 10) / 10)
        }
    }

    const PreviousPage = () => {
        setShowNext(shownext - 10)
        setCurrentPage(shownext / 10)
    }

    const getcurrentPage = (e) => {
        if (e.target.textContent !== "...") {
            setShowNext(Number(e.target.textContent) * 10 - 10)
            setCurrentPage(Number(e.target.textContent))
        }
    }

    useEffect(() => {
        axios.get("https://fakerapi.it/api/v1/companies?_quantity=100")
            .then((response) => {
                setTableData(response.data.data)
            })
    }, [])

    return (
        <>
            {
                tableData.length > 0 ?
                    <>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <td>Id</td>
                                    <td>Name <button name="nameSorting" type="button" onClick={(e) => { sortDescending(e) }}>Sort</button> </td>
                                    <td>Email</td>
                                    <td>Phone</td>
                                    <td>Country</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tableData.slice(shownext, shownext + 10).map((value, index) => {
                                        const indexValue = index
                                        return (
                                            <tr key={indexValue}>
                                                <td>{value.id}</td>
                                                <td>{value.name}</td>
                                                <td>{value.email}</td>
                                                <td>{value.phone}</td>
                                                <td>{value.country}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <div className="">
                            <button onClick={shownext !== 0 ? () => PreviousPage() : ""}> Previous Page</button>
                            {
                                Pagination().map(
                                    (pageNumber, index) => {
                                        const indexValue = index
                                        return (
                                            <button key={indexValue} onClick={(e) => getcurrentPage(e)}>{pageNumber}</button>
                                        )
                                    }
                                )
                            }
                            <button onClick={tableData.length > shownext + 10 ? () => NextPage() : ""}>Next Page</button>
                        </div>
                    </>
                    :
                    <div>Loading</div>
            }
        </>
    )
}

export default Table;