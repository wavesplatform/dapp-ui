/** @jsx jsx */
import React from "react";
import Head from ".//Head";
import { jsx } from "@emotion/core";
import { Bg } from "@src/assets/icons/Bg";
import Search from "@components/Search";

const styles = {}

export default class Home extends React.Component {
    render() {
        return <Bg>
            <Head/>
            <Search />
        </Bg>
    }
}
