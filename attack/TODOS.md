Requirements:
    Receive indications from Scanner (discuss format, probably contain endpoint and vulnerability name *and relevant parameters for now?* )
    Run "build configs" to start a codebase server and run it for vuln testing
    Send requests exploiting the requests vulnerability indicated (*modularity is challenging, v0 uses only flask api*)


V0:
    Scanner Comm:
        Structurize
        Listen
        Implement



    Attack:
        Develop demo server with unprotected route
        Structurize run config\
        Run server
        Implement SQLi Attacker --> Send requests according to Scanner indication
        *VERIFY IT WORKED*
        Report to IDE if succeeded.




Presentation:
    Close things up
    Keynote
    Update URLs