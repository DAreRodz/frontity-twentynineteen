import React, { useEffect } from "react";
import { connect, styled } from "frontity";
import Link from "../link";
import PreviousIcon from "../icons/previous-icon";
import NextIcon from "../icons/next-icon";

const Pagination = ( { state, actions, libraries } ) => {
	const { totalPages }        = state.source.get( state.router.link );
	const { path, page, query } = libraries.source.parse( state.router.link );

	const isThereNextPage     = page < totalPages;
	const isTherePreviousPage = page > 1;

	/**
	 * Get the required page link.
	 *
	 * @param {int} pageNo Page No.
	 * @return {string} Post permalink.
	 */
	const getPageLink = ( pageNo ) => {
		return libraries.source.stringify({
			path,
			page: pageNo,
			query
		});
	};

	/**
	 * Handle Pagination.
	 *
	 * @param {int} index Index.
	 * @return {Array} Page no array for pagination content.
	 */
	const c = ( index ) => {

		let content = '';
		const pageNo = index + 1;

		if ( page !== pageNo ) {
			content = (
				<Link className="page-numbers" link={ getPageLink( index + 1 ) }>
					<Text>{ index + 1 }</Text>
				</Link>
			);
		} else {
			content = (
				<span className="page-numbers current">
						<Text>{ index + 1 }</Text>
				</span>
			)
		}

		return content;
	};

	const createPaginationArray = ( page, totalPages ) => {

		const currentPage = page;

		let loopableArray = [] ;

		if ( 0 < ( currentPage - 2 ) ) {
			loopableArray.push( ( currentPage - 2 ) );
		}

		if ( 0 < ( currentPage - 1 ) ) {
			loopableArray.push( ( currentPage - 1 ) );
		}

		loopableArray.push( currentPage );

		if ( totalPages >= ( currentPage + 1 ) ) {
			loopableArray.push( ( currentPage + 1 ) );
		}

		if ( totalPages >= ( currentPage + 2 ) ) {
			loopableArray.push( ( currentPage + 2 ) );
		}

		/**
		 * Push the ... at the beginning of the array
		 * only if the difference of between the 1st and 2nd item is greater than 1.
		 */
		if ( 1 < (loopableArray[0] - 1 )  ) {
			loopableArray.unshift( '...' );
		}

		/**
		 * Push the ... at the end of the array.
		 * only if the difference of between the last and 2nd last item is greater than 1.
		 */
		if ( 1 < ( totalPages - loopableArray[ loopableArray.length - 2 ] )  ) {
			loopableArray.push( '...' );
		}

		// Push first item in the array if it does not already exists.
		if ( -1 === loopableArray.indexOf( 1 ) ) {
			loopableArray.unshift( 1 );
		}


		// Push last item in the array if it does not already exists.
		if ( -1 === loopableArray.indexOf( totalPages ) ) {
			loopableArray.push( totalPages );
		}

		return loopableArray;

	};

	const paginationArray = createPaginationArray();

	// Fetch the next page if it hasn't been fetched yet.
	useEffect( () => {
		if ( isThereNextPage ) actions.source.fetch( getPageLink( page + 1 ) );
	}, [] );


	return (
		<PaginationContainer className="tn-pagination">
			{ isTherePreviousPage && (
				<Link className="pagination-links" link={ getPageLink( page - 1 ) }>
					<Text><PreviousIcon/> Newer posts</Text>
				</Link>
			) }

			<>
			
			</>

			{ isThereNextPage && (
				<Link className="pagination-links" link={ getPageLink( page + 1 ) }>
					<Text> Older posts <NextIcon/></Text>
				</Link>
			) }
		</PaginationContainer>
	);
};

export default connect( Pagination );

const NavLinkSeparator = styled.span`
	padding: 1rem;
`;

const PaginationContainer = styled.div`

    margin: calc(3 * 1rem) calc(10% + 60px) calc(1rem / 2);
	& .pagination-links {
		display: inline-block;
	    margin-left: 0 !important;
	    font-size: 0.88889em;
	    color: #0073aa;
	    transition: color 110ms ease-in-out;
	    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
	    font-weight: 700;
	    letter-spacing: -0.02em;
	    line-height: 1.2;
	    -webkit-font-smoothing: antialiased;
	}

		span {
			padding: 0;
		}
	}
`;

const Text = styled.span`
  display: inline-block;
  margin-top: 16px;
`;
